import { Feed } from 'feed';

export function tap(value, callback) {
    callback(value);
    return value;
}

export function match(value, expressions) {
    if (typeof expressions !== 'object') {
        throw new Error('Expressions should be an object');
    }

    if (value in expressions) {
        return expressions[value];
    }

    if ('default' in expressions) {
        return expressions['default'];
    }

    throw new Error('No match found and no default provided');
}

export async function get(target, params = {}) {
    const url = new URL(target);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');

    return isJson ? await response.json() : await response.text();
}

export class VideoFeed {
    constructor(profile) {
        this.profile = profile;
        this.feed = this.initFeed();
    }

    static async factory(profile) {
        const instance = new this(profile);
        await instance.fetchAll();
        return instance;
    }

    initFeed() {
        const { name, username, id, updatedAt } = this.profile;
        return new Feed({
            id: `${id}`,
            title: `${name}`,
            description: `${name} - videos`,
            link: `https://www.iwara.tv/profile/${username}`,
            updated: updatedAt,
        });
    }

    maxPage() {
        return Math.ceil(this.profile.count / 50);
    }

    async fetchAll() {
        for (let page = 0; page < this.maxPage(); page++) {
            const data = await get(`https://api.iwara.tv/videos`, {
                user: this.profile.id,
                limit: 50,
                sort: 'date',
                page,
            });
            data.results.forEach((post) => {
                this.add(post);
            });
        }
    }

    add(post) {
        let src = `https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=Not+Found`;
        if (!!post.file) {
            let thumb = String(post.thumbnail).padStart(2, 0);
            src = `https://i.iwara.tv/image/original/${post.file.id}/thumbnail-${thumb}.jpg`;
        }

        this.feed.addItem({
            id: post.id,
            title: post.title,
            description: `<img src='${src}' referrerpolicy='no-referrer'>`,
            link: `https://www.iwara.tv/video/${post.id}`,
            date: new Date(post.createdAt),
            author: [{
                name: post.user.name,
                link: `https://www.iwara.tv/profile/${post.user.username}`,
            }],
        });
    }

    getRss() {
        return this.feed.rss2();
    }

    getAtom() {
        return this.feed.atom1();
    }

    getJson() {
        return this.feed.json1();
    }

    get() {
        return this.feed;
    }
}

export class FeedResponse {
    constructor(videoFeed) {
        this.videoFeed = videoFeed;
    }

    json() {
        return new Response(this.videoFeed.getJson(), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    }

    rss() {
        return new Response(this.videoFeed.getRss(), {
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
            },
        });
    }

    atom() {
        return new Response(this.videoFeed.getAtom(), {
            headers: {
                'Content-Type': 'application/atom+xml; charset=utf-8',
            },
        });
    }
}
