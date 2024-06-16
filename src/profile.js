import { getData } from './helper'

export default async ({ username }) => {
    const profile = await getData(`https://api.iwara.tv/profile/${username}`);
    const videos = await getData(`https://api.iwara.tv/videos?user=${profile.user.id}&limit=1&sort=date`);

    return {
        id: profile.user.id,
        name: profile.user.name,
        username: profile.user.username,
        count: videos.count,
        updateAt: videos.results[0].createdAt,
    };
}
