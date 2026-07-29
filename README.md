<p align="center">
  <img src="assets/banner.png" alt="YugenAnime Banner" width="100%" />
</p>

<h1 align="center">YugenAnime</h1>

<p align="center">
A modern anime streaming application built with Next.js and powered by the AniKoto API.
</p>

## About

YugenAnime is a lightweight anime streaming application inspired by the clean and minimal experience of the original YugenAnime website.

The project focuses on fast navigation, responsive design, local-first user preferences, and a simple viewing experience without accounts or cloud synchronization.

## Features

- Responsive interface
- Anime search
- Anime details
- Episode streaming
- Sub & Dub switching
- Weekly airing schedule
- Trending and latest updates
- Continue watching
- Local watch history
- Multi-server playback

## Project Structure

```text
yugen/
├── frontend/
├── external/
│   └── AniKotoAPI-main/
├── reference/
└── README.md
```

## Local Development

### Start the API

```bash
cd external/AniKotoAPI-main
npm install
npm start
```

API

```
http://localhost:4444
```

### Start the Frontend

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

```env
NEXT_PUBLIC_API_BASE=http://localhost:4444/api
```

Run:

```bash
npm run dev
```

Open

```
http://localhost:3000
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE` | AniKoto API base URL |

## Deployment

### Backend

Host the AniKoto API.

Docker example:

```bash
cd external/AniKotoAPI-main

docker build -t anikoto-api .

docker run -d \
  --name anikoto-api \
  -p 4444:4444 \
  --restart unless-stopped \
  -e PORT=4444 \
  anikoto-api
```

### Frontend

Deploy the `frontend` directory.

Production environment variable:

```env
NEXT_PUBLIC_API_BASE=https://api.example.com/api
```

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend

- AniKoto API
- Express.js

## License

MIT License

See the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is an independent open-source application inspired by the original YugenAnime interface.

It is not affiliated with or endorsed by YugenAnime or AniKoto.
