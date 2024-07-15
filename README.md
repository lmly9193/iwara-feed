# Iwara Feed

Iwara Feed is a service that generates RSS feeds for Iwara users. It is designed to run on Cloudflare Workers.

## Features

- Generate Atom 1.0, RSS 2.0, and JSON feeds for any Iwara user.
- Designed to run efficiently on Cloudflare Workers.

## Usage

You can access the feeds at the following URLs, replacing `:username` with the username of the Iwara user you want to generate a feed for and `:format` with the desired feed format (`atom`, `rss`, or `json`).

```
http://localhost:8787/:username/:format
```

## Installation

1. Clone this repository: `git clone https://github.com/lmly9193/iwara-feed.git`
2. Install the dependencies: `pnpm install`
3. Start the server: `pnpm run dev`

## Deploy

To deploy this service to Cloudflare Workers, follow these steps:

1. Update the name of your workers in the `wrangler.toml` file.
2. Deploy the service: `pnpm run deploy`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
