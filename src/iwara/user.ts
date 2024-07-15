import { get } from '../utils';

export class User {
  id: string;
  name: string;
  username: string;

  constructor({ id, name, username }: API.User) {
    this.id = id;
    this.name = name;
    this.username = username;
  }

  static async find(username: string): Promise<User> {
    try {
      const { user }: API.Profile = await get(`https://api.iwara.tv/profile/${username}`);
      return new this(user);
    } catch (error) {
      throw new Error(`User not found: ${username}`);
    }
  }

  async video(): Promise<API.Video[]> {
    let data: API.Video[] = [];
    let qty: number = 0;
    let page: number = 0;

    do {
      const search: API.Search = await get(`https://api.iwara.tv/videos`, {
        user: this.id,
        page: page++,
        sort: 'date',
        limit: 50,
      });
      qty = search.count;
      data = data.concat(search.results);
    } while (data.length < qty);

    return data;
  }
}
