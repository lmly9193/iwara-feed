const axios = require('axios');
const express = require('express');
const Feed = require('feed').Feed;
const fs = require('fs');

const app = express();
app.use(express.static('mocks'));

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.get('/user/:username', async (req, res) => {
    const request = await axios.get(`https://api.iwara.tv/profile/${req.params.username}`);
    const data = request.data;
    data.feed = `https://iwara-rss.vercel.app/videos/${data.user.id}`;
    return res.json(data);
});

app.get('/videos/:user', async (req, res) => {
    let limit = 50;
    let page = 0;
    let count = 0;
    let posts = [];
    while (page * limit <= count) {
        const options = {
            params: {
                limit: limit,
                page: page,
                sort: 'date',
                user: req.params.user,
            }
        };
        const request = await axios.get('https://api.iwara.tv/videos', options);
        count = request.data.count;
        page = request.data.page;
        posts.push(...request.data.results);
        page++;
    }

    const feed = new Feed({
        title: `${posts[0].user.name}`,
        description: `${posts[0].user.name} - videos`,
        id: `${posts[0].user.id}`,
        link: `https://www.iwara.tv/profile/${posts[0].user.username}`,
        updated: new Date(Date.parse(posts[0].createdAt)),
    });

    posts.forEach(post => {
        let thumbnail;
        if (!!post.file) {
            thumbnail = `<img src="https://i.iwara.tv/image/original/${post.file.id}/thumbnail-${String(post.thumbnail).padStart(2, 0)}.jpg" referrerpolicy="no-referrer">`;
        } else {
            thumbnail = `<img src="https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=Not+Found" referrerpolicy="no-referrer">`;
        }
        feed.addItem({
            title: post.title,
            id: post.id,
            link: `https://www.iwara.tv/video/${post.id}`,
            description: thumbnail,
            content: post.content,
            author: [
                {
                    name: post.user.name,
                    link: `https://www.iwara.tv/profile/${post.user.username}`
                }
            ],
            date: new Date(Date.parse(post.createdAt)),
        });
    });

    res.set('Content-Type', 'application/rss+xml');
    return res.send(feed.rss2());
});

app.get('/mock/user', (req, res) => {
    let data = JSON.parse(fs.readFileSync(`${__dirname}/mocks/user.json`));
    return res.json(data);
});

app.get('/mock/videos', (req, res) => {
    let data = JSON.parse(fs.readFileSync(`${__dirname}/mocks/videos.json`));
    return res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));

module.exports = app;
