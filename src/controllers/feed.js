import { match, VideoFeed, FeedResponse } from "../helpers";
import profile from "./profile";

export default async ({ params: { username }, query: { format } }) => {
    const feed = await VideoFeed.factory(await profile({ username }));
    const response = new FeedResponse(feed);

    return match(format, {
        'dev': () => feed.get(),
        'json': () => response.json(),
        'rss': () => response.rss(),
        'atom': () => response.atom(),
        'default': () => response.atom(),
    })();
}
