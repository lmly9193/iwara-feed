import { Feed } from 'feed';
import { User } from './user';

export class Feeder {
  feed: Feed;

  constructor(user: User) {
    this.feed = new Feed({
      title: `${user.name} - Iwara`,
      description: `${user.name}'s videos`,
      id: `https://www.iwara.tv/profile/${user.username}`,
      link: `https://www.iwara.tv/profile/${user.username}/videos`,
      copyright: `${user.name}`,
    });
  }

  static async create(user: User): Promise<Feeder> {
    const feeder = new this(user);
    feeder.import(await user.video());
    return feeder;
  }

  import(list: API.Video[]): void {
    for (const video of list) {
      this.add(video);
    }
  }

  add(video: API.Video): void {
    let src = `https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=Not+Found`;
    if (!!video.file) {
      let thumb = String(video.thumbnail.toString()).padStart(2, '0');
      src = `https://i.iwara.tv/image/original/${video.file.id}/thumbnail-${thumb}.jpg`;
    }

    this.feed.addItem({
      id: video.id,
      title: video.title,
      description: `<img src='${src}' referrerpolicy='no-referrer'>`,
      link: `https://www.iwara.tv/video/${video.id}`,
      date: new Date(video.createdAt),
      author: [
        {
          name: video.user.name,
          link: `https://www.iwara.tv/profile/${video.user.username}`,
        },
      ],
    });
  }

  rss(): string {
    return this.feed.rss2();
  }

  atom(): string {
    return this.feed.atom1();
  }

  json(): string {
    return this.feed.json1();
  }
}
