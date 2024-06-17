import { User, Feeder } from '../iwara';
import { response } from '../utils';

export async function feed({ username, format = 'atom' }) {
    const user = await User.from(username);
    const feeder = await Feeder.create(user);
    return response[format](feeder[format]());
}
