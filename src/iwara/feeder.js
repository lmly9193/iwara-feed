import { Feed } from 'feed';

// Todo: 解藕類型
export class Feeder {
    constructor(user) {
        this.feed = new Feed({
            title: `${user.name} - Iwara`,
            description: `${user.name}'s videos`,
            id: `https://www.iwara.tv/profile/${user.username}`,
            link: `https://www.iwara.tv/profile/${user.username}/videos`
        });
    }

    static async create(user) {
        const feeder = new this(user);
        await feeder.#import(await user.videos());
        return feeder;
    }

    async #import(videos) {
        for (const video of videos) {
            this.#add(video);
        }
    }

    #add(video) {
        let src = `https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=Not+Found`;
        if (!!video.file) {
            let thumb = String(video.thumbnail).padStart(2, 0);
            src = `https://i.iwara.tv/image/original/${video.file.id}/thumbnail-${thumb}.jpg`;
        }

        this.feed.addItem({
            id: video.id,
            title: video.title,
            description: `<img src='${src}' referrerpolicy='no-referrer'>`,
            link: `https://www.iwara.tv/video/${video.id}`,
            date: new Date(video.createdAt),
            author: [{
                name: video.user.name,
                link: `https://www.iwara.tv/profile/${video.user.username}`,
            }],
        });
    }

    rss() {
        return this.feed.rss2();
    }

    atom() {
        return this.feed.atom1();
    }

    json() {
        return this.feed.json1();
    }
}
