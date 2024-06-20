import { get } from '../utils';
import { IwaraUser, IwaraProfile, IwaraVideoSearch, IwaraVideo, IUser, IUserFactory } from '../types';

export class User implements IUser {
  id: string;
  name: string;
  username: string;

  constructor({ id, name, username }: IwaraUser) {
    this.id = id;
    this.name = name;
    this.username = username;
  }

  static async from(this: IUserFactory, username: string): Promise<User> {
    try {
      const { user }: IwaraProfile = await get(`https://api.iwara.tv/profile/${username}`);
      return new this(user);
    } catch (error) {
      throw new Error(`User not found: ${username}`);
    }
  }

  async video(): Promise<IwaraVideo[]> {
    let data: IwaraVideo[] = [];
    let qty: number = 0;
    let page: number = 0;

    do {
      const search: IwaraVideoSearch = await get(`https://api.iwara.tv/videos`, {
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
