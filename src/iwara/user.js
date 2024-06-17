import { get } from '../utils';

export class User {
    constructor({ id, username, name }) {
        this.id = id;
        this.username = username;
        this.name = name;
    }

    static async from(username) {
        const { user } = await get(`https://api.iwara.tv/profile/${username}`);
        return new this(user);
    }

    async videos() {
        let data = [];
        let qty = 0;
        let page = 0;

        do {
            const response = await get(`https://api.iwara.tv/videos`, {
                user: this.id,
                page: page++,
                sort: 'date',
                limit: 50,
            });
            qty = response.count;
            data = data.concat(response.results);
        } while (data.length !== qty);

        return data;
    }
}
