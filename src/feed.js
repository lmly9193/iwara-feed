import { getData } from "./helper";
import { Feed } from "feed";
import getProfile from "./profile";

class List {
    constructor(profile) {
        this.profile = profile;
        this.feed = this.initFeed();
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
        return Math.ceil(this.profile.count / 50)
    }

    async sync() {
        for (let page = 0; page < this.maxPage(); page++) {
            const data = await getData(`https://api.iwara.tv/videos?user=${this.profile.id}&page=${page}&limit=50&sort=date`);
            data.results.forEach(post => {
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
            description: `<img src="${src}" referrerpolicy="no-referrer">`,
            link: `https://www.iwara.tv/video/${post.id}`,
            date: new Date(post.createdAt),
            author: [{
                name: post.user.name,
                link: `https://www.iwara.tv/profile/${post.user.username}`
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

export default async ({ params, query }) => {
    const list = new List(await getProfile(params));
    await list.sync();

    if (query.format === 'dev') {
        return list.get();
    }

    if (query.format === 'json') {
        return new Response(list.getJson(), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    if (query.format === 'rss') {
        return new Response(list.getRss(), {
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
            },
        });
    }

    return new Response(list.getAtom(), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8',
        },
    });
}
