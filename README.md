# BeatMap

> AI-powered music intelligence engine — turn any song link or live recording into timestamped scene-fit intelligence for video creators.

BeatMap answers the question every creator, editor, and marketer actually needs answered:

**Which part of this song should I use — and for what?**

Paste a YouTube or SoundCloud link, pick your video type, and BeatMap returns timestamped mood shifts, the best opening moment, optimal cut windows (15s / 30s / 45s), a step-by-step shot plan, voiceover-safe sections, and scene-fit scores — all tailored to your edit type.

---

## What's been built

### Core analysis pipeline

- YouTube and SoundCloud link parsing (video ID, track path)
- Real YouTube Data API v3 metadata fetching (title, artist, thumbnail)
- SoundCloud oEmbed metadata fetching (no key required)
- Microphone recording via the browser MediaRecorder API
- Groq (primary AI — `llama-3.3-70b-versatile`) + Google Gemini Flash Lite (fallback) dual-provider chain
- Audio file upload to Gemini Files API for actual audio analysis
- Graceful degradation — if both AI providers fail, honest placeholder returned (never silent)
- SQLite persistence for all past analyses, with preset column

### Edit-type presets (15 types)

Every analysis is tailored to the creator's video type. The AI prompts change based on the selected preset:

| Preset | Purpose |
|--------|---------|
| Instagram Reel | Punchy 15–30s hooks |
| TikTok / Short | Attention-grabbing opening second |
| YouTube Intro | 10–20s dramatic channel opener |
| Travel Montage | Scenic builds and cinematic transitions |
| Product Ad | Clean intro + clear payoff CTA |
| Fashion / Luxury | Smooth, elegant atmospheric sections |
| Emotional Story | Gentle builds and heartfelt peaks |
| Wedding / Memory | Warm, romantic sections |
| Gym / Hype Edit | Hard drops and intense energy peaks |
| Podcast Intro | Professional 5–15s opener |
| Documentary | Cinematic builds and tension |
| Gaming Montage | Intense beats and dramatic finish |
| Vlog | Upbeat but doesn't overpower speech |
| Slideshow / Memories | Gentle, nostalgic sections |
| General Edit | Balanced for any use |

### Analysis output (per analysis)

- **Summary** — 2–3 sentence description tailored to the selected preset
- **Energy map** — 4–6 timestamped mood shifts with `low / medium / high` intensity
- **Best opening moment** — single strongest hook window for the chosen edit type
- **Best cuts** — optimal 15s, 30s, and 45s windows with confidence scores and preset-specific reasoning
- **Shot plan** — 5–7 step sequential cut plan describing what to show and when
- **Voiceover sections** — `great / okay / risky` safety ratings with plain-English reasons
- **Scene fits** — 3–4 creative use categories with confidence scores and timestamp ranges
- **Similar tracks** — 2–3 free-to-use alternatives from open libraries

### Trending tracks

- `GET /api/trending?language=worldwide` — live YouTube Music chart
- 8 language tabs: Worldwide, English, Hindi, Telugu, Tamil, Spanish, Korean, Japanese
- One-click "Analyse →" from any trending card passes the URL directly into analysis
- Curated fallback list for each language if YouTube API is rate-limited or unavailable

### Track comparison

- `POST /api/compare` — analyse 2–3 songs simultaneously for a given edit type
- Returns a ranked winner with per-track fit scores, best cut windows, voiceover suitability, and emotional payoff summary

### Frontend UI

- Hero with animated AI character carousel (producer, cyberdj, jazzman, lofi, raver)
- Preset selector grid above all inputs
- Scrolling marquee strip and three-column animated card showcase
- Analysis result dashboard with colour-coded cards for all output sections
- History panel for past analyses
- Compare panel for multi-track evaluation

---

## Tech stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 | React framework, routing, API proxying |
| React | 19 | UI rendering |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| next/font | — | Syne (display) + Inter (body) fonts |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | latest | REST API framework |
| Python | 3.12 | Runtime |
| Pydantic | v2 | Schema validation |
| Uvicorn | latest | ASGI server |
| HTTPX | latest | Async HTTP client |
| Groq SDK | latest | Primary AI (Llama 3.3 70b) |
| google-genai | latest | Gemini AI (fallback + audio) |
| SQLite | stdlib | Analysis persistence |
| python-dotenv | latest | Environment variable loading |

### AI providers

| Provider | Model | Role |
|---------|-------|------|
| Groq | `llama-3.3-70b-versatile` | Primary — fast metadata analysis |
| Google Gemini | `gemini-2.0-flash-lite` | Fallback + audio file analysis |

---

## Repository structure

```
beatmap/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              main page (all tabs, preset, trending)
│       │   ├── layout.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── analysis-result.tsx   full result dashboard
│       │   ├── best-cuts-section.tsx 15s / 30s / 45s cut cards
│       │   ├── shot-plan-section.tsx step-by-step editing timeline
│       │   ├── preset-selector.tsx   15-type edit preset grid
│       │   ├── trending-section.tsx  live trending tracks (8 languages)
│       │   ├── compare-tracks.tsx    multi-song comparison panel
│       │   ├── link-input-form.tsx   URL input
│       │   ├── recorder.tsx          mic recording
│       │   ├── creature-showcase.tsx animated AI character carousel
│       │   ├── hero-background.tsx   gradient blob background
│       │   ├── marquee-strip.tsx     scrolling banner
│       │   ├── scrolling-cards.tsx   animated card showcase
│       │   ├── empty-state.tsx       pre-analysis hint
│       │   ├── recent-analyses.tsx   history panel
│       │   └── result-card.tsx       generic card wrapper
│       ├── types/
│       │   └── analysis.ts           all TypeScript types + PRESET_OPTIONS
│       └── lib/
│           ├── api.ts                typed API client
│           ├── formatters.ts         label helpers
│           └── platform.ts           platform display helper
│
├── backend/
│   └── app/
│       ├── main.py                   FastAPI app + CORS + lifespan
│       ├── settings.py               env-based config
│       ├── api/
│       │   ├── routes.py             all API endpoints
│       │   ├── schemas.py            Pydantic models (request + response)
│       │   ├── link_utils.py         platform detection
│       │   ├── youtube_utils.py      YouTube video ID extraction
│       │   └── soundcloud_utils.py   SoundCloud path extraction
│       └── services/
│           ├── gemini/
│           │   └── client.py         Groq + Gemini AI chain, preset prompts
│           ├── metadata/
│           │   ├── youtube.py        YouTube Data API v3 client
│           │   └── soundcloud.py     SoundCloud oEmbed client
│           ├── orchestration/
│           │   └── analyzer.py       analysis pipeline (link + audio)
│           ├── trending/
│           │   └── youtube.py        trending tracks + curated fallback
│           ├── comparison/
│           │   └── compare.py        multi-track comparison + fit scoring
│           ├── audio/
│           │   └── processor.py      audio file utilities
│           └── persistence/
│               └── db.py             SQLite CRUD
│
└── README.md
```

---

## API endpoints

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/api/analyze/link` | `{ url, preset }` | Analyse a YouTube or SoundCloud link |
| `POST` | `/api/analyze/audio` | multipart file + preset | Analyse a mic recording or audio file |
| `GET` | `/api/trending` | `?language=worldwide&limit=10` | Fetch trending music tracks |
| `POST` | `/api/compare` | `{ urls: [...], preset }` | Compare 2–3 songs for a given edit type |
| `GET` | `/api/analyses` | — | List past analyses (max 20) |
| `GET` | `/api/analyses/{id}` | — | Get full analysis by ID |
| `DELETE` | `/api/analyses/{id}` | — | Delete an analysis |

---

## Environment variables required

| Variable | Required | Purpose |
|----------|----------|---------|
| `GROQ_API_KEY` | Recommended | Primary AI provider (fast, free tier available) |
| `GEMINI_API_KEY` | Optional | AI fallback + audio file analysis |
| `YOUTUBE_API_KEY` | Recommended | YouTube metadata + trending tracks |
| `DB_PATH` | Optional | SQLite file path (default: `beatmap.db`) |

Get a free Groq key at [console.groq.com](https://console.groq.com).  
Get a YouTube Data API v3 key at [console.cloud.google.com](https://console.cloud.google.com).  
Get a Gemini key at [aistudio.google.com](https://aistudio.google.com).

---

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Runs on http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

The frontend proxies `/api/*` to the backend via Next.js rewrites, so both run together with no CORS issues in development.

---

## Development log

### Day 1 — Project setup
- Created GitHub repository, README, gitignore, MIT license
- Built Next.js frontend with Tailwind CSS
- Created FastAPI backend with `/health` and `/api/analyze/link` endpoints
- Added Pydantic schemas and placeholder analysis response
- Built initial analysis dashboard with mock data

### Day 2 — Link intelligence pipeline
- Platform detection for YouTube and SoundCloud links
- YouTube video ID extraction (all link formats)
- SoundCloud artist/track path extraction
- API returns platform-specific identifiers

### Day 3 — Real metadata
- YouTube Data API v3 integration — real title, channel, thumbnail
- SoundCloud oEmbed metadata fetching (no key required)
- Frontend shows real thumbnails and song info

### Day 4 — AI analysis engine
- Groq (llama-3.3-70b) primary + Gemini Flash Lite fallback AI chain
- Structured JSON analysis: mood shifts, hook window, voiceover sections, scene fits, alternatives
- Audio upload endpoint with Gemini Files API for actual audio analysis
- Microphone recording in the browser (MediaRecorder API)
- SQLite persistence for all analyses
- Graceful degradation with honest error labels

### Day 5 — Hero UI + animated characters
- Animated AI character carousel (producer, cyberdj, jazzman, lofi, raver)
- Gradient blob hero background, marquee strip, scrolling card showcase
- History panel for past analyses

### Day 6 — Creator intelligence features
- **15 edit-type presets** with tailored AI system prompts
- **Best Cut Generator** — optimal 15s / 30s / 45s windows with confidence scores
- **Shot Plan** — 5–7 step sequential editing plan per video type
- **Upgraded voiceover guidance** — `great / okay / risky` safety levels with plain-English reasons
- **Trending tracks** — live YouTube chart in 8 languages + curated fallback
- **Track comparison** — compare 2–3 songs and get a ranked fit winner
- Full frontend integration: preset selector, best cuts panel, shot plan timeline, compare panel, trending section

---

## License

MIT
