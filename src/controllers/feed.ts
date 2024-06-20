import { User, Feeder } from '../iwara';
import { response } from '../utils';
import { FeedRequest } from '../types';

export async function feed({ username, format }: FeedRequest) {
  const user = await User.from(username);
  const feeder = await Feeder.create(user);

  if (format === undefined || response[format] === undefined) {
    return response.atom(feeder.atom());
  }

  return response[format](feeder[format]());
}
