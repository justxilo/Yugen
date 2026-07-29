# YugenAnime

A lightweight Next.js 15 rebuild inspired by the original **YugenAnime** streaming platform.

## Features

- **UI**:recreation of YugenAnime.
- **Sub & Dub**: Instant audio mode toggle across search, details, and video player.
- **Weekly Schedule**: Airing schedule grid with real-time broadcast times.
- **Multi-Server Streaming**: Selectable video mirrors (Vidstreaming, MegaCloud, etc.).
- **Local State**: Watch history and preferences stored locally in your browser.

---

## Project Structure

```text
yugen/
├── frontend/             # Next.js 15 App Router frontend
└── external/
    └── AniKotoAPI-main/  # Express.js scraping API server
```

---

## Quick Start (Local Development)

### 1. Start the AniKoto API (Backend)

```bash
cd external/AniKotoAPI-main
npm install
npm start
```
*Runs locally on `http://localhost:4444`.*

### 2. Start the Frontend (Next.js)

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:4444/api
```

Run the dev server:
```bash
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## Production Deployment Guide

### Backend: Host AniKoto API (Docker)

run this in your terminal :
```bash
cd external/AniKotoAPI-main

# Build & run Docker container
docker build -t anikoto-api .
docker run -d \
  --name anikoto-api \
  -p 4444:4444 \
  --restart unless-stopped \
  -e PORT=4444 \
  -e ALLOWED_ORIGINS="https://your-app.vercel.app" \
  anikoto-api
```

Expose the container with Nginx SSL or Cloudflare Tunnel:
```bash
cloudflared tunnel run --url http://localhost:4444
```

---

### Frontend: Host Next.js on (Vercel)

1. Import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. In Project Settings → **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_BASE` | `https://api.yourdomain.com/api` |

4. Deploy.

---

## Environment Variables

| Variable | Description | Local Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE` | Base URL of the AniKoto API | `http://localhost:4444/api` |

---

## License

MIT
