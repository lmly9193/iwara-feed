import { User, Feeder } from '../iwara';
import { response } from '../utils';

type Request = {
  username: string;
  format?: 'atom' | 'rss' | 'json';
};

export async function feed({ username, format }: Request) {
  const user = await User.find(username);
  const feeder = await Feeder.create(user);

  if (format === undefined || response[format] === undefined) {
    return response.atom(feeder.atom());
  }

  return response[format](feeder[format]());
}
