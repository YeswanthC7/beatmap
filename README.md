# BeatMap

> AI-powered music intelligence engine — turn any song link or live recording into timestamped edit plans for video creators.

BeatMap answers the question every creator, editor, and marketer needs answered:

**Which part of this song should I use — and for what?**

Paste a YouTube or SoundCloud link, pick your video type, and BeatMap returns timestamped mood shifts, the best opening moment, optimal cut windows (15s / 30s / 45s), a step-by-step shot plan, voiceover-safe sections, and scene-fit scores — all tailored to your edit type.

---

## Features

### Core analysis pipeline

- YouTube and SoundCloud link parsing (video ID, track path)
- Real YouTube Data API v3 metadata fetching (title, artist, thumbnail)
- SoundCloud oEmbed metadata fetching (no key required)
- Microphone recording via the browser MediaRecorder API
- Groq (`llama-3.3-70b-versatile`) primary + Google Gemini Flash Lite fallback AI chain
- Audio file upload to Gemini Files API for actual audio analysis
- Graceful degradation — if both AI providers fail, honest placeholder returned (never silent)
- SQLite persistence for all past analyses, with preset column

### Edit-type presets (15 types)

Every analysis is tailored to the creator's video type:

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

### Analysis output (per song)

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
- Curated fallback list for each language if YouTube API is rate-limited

### Track comparison

- `POST /api/compare` — analyse 2–3 songs simultaneously for a given edit type
- Returns a ranked winner with per-track fit scores, best cut windows, voiceover suitability, and emotional payoff summary

---

## Design

BeatMap uses a Web3 brutalist visual system:

- **Typography** — Anton (display) + Space Grotesk (body)
- **Palette** — Deep black (`#0B0C10`) base, neon green (`#CCFF00`) as the sole accent/CTA colour, white for text
- **Layout** — Hard edges, 1px borders, no border-radius except chips
- **Motion** — Subtle glitch preloader, floating AI character illustrations, scroll-reveal sections
- **Sections** — Hero with animated word cycle, faction preset panels, full analyse dashboard, trending chart, FAQ, footer

---

## Tech stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework, routing, API proxying |
| React 19 | UI rendering |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Utility styling |
| Framer Motion | Animations and transitions |
| Anton + Space Grotesk | Display and body fonts |

### Backend

| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Python 3.12 | Runtime |
| Pydantic v2 | Schema validation |
| Uvicorn | ASGI server |
| HTTPX | Async HTTP client |
| Groq SDK | Primary AI (Llama 3.3 70b) |
| google-genai | Gemini AI (fallback + audio) |
| SQLite | Analysis persistence |

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
│       │   ├── page.tsx                   main page orchestrator
│       │   ├── layout.tsx                 fonts, metadata
│       │   ├── globals.css                design system (palette, glitch, marquee)
│       │   └── how-it-works/page.tsx      explainer page
│       ├── components/
│       │   ├── bm-loader.tsx              preloader with glitch animation
│       │   ├── bm-nav.tsx                 frosted-glass fixed nav
│       │   ├── bm-progress.tsx            scroll-position dot indicator
│       │   ├── bm-hero.tsx                hero section with animated word cycle
│       │   ├── bm-factions.tsx            preset faction panels
│       │   ├── bm-analyze.tsx             analyse dashboard (link / mic / compare / history)
│       │   ├── bm-trending.tsx            trending tracks in 8 languages
│       │   ├── bm-faq.tsx                 FAQ accordion
│       │   ├── bm-footer.tsx              footer with big CTA
│       │   ├── analysis-result.tsx        full result dashboard
│       │   ├── best-cuts-section.tsx      15s / 30s / 45s cut cards
│       │   ├── shot-plan-section.tsx      step-by-step editing timeline
│       │   ├── compare-tracks.tsx         multi-song comparison panel
│       │   ├── recorder.tsx               mic recording (MediaRecorder)
│       │   └── recent-analyses-section.tsx history panel
│       ├── types/
│       │   └── analysis.ts                all TypeScript types + PRESET_OPTIONS
│       └── lib/
│           ├── api.ts                     typed API client
│           ├── formatters.ts              label helpers
│           └── platform.ts                platform display helper
│
├── backend/
│   └── app/
│       ├── main.py                        FastAPI app + CORS + lifespan
│       ├── settings.py                    env-based config
│       ├── api/
│       │   ├── routes.py                  all API endpoints
│       │   ├── schemas.py                 Pydantic models
│       │   ├── link_utils.py              platform detection
│       │   ├── youtube_utils.py           YouTube video ID extraction
│       │   └── soundcloud_utils.py        SoundCloud path extraction
│       └── services/
│           ├── gemini/client.py           Groq + Gemini AI chain, preset prompts
│           ├── metadata/youtube.py        YouTube Data API v3 client
│           ├── metadata/soundcloud.py     SoundCloud oEmbed client
│           ├── orchestration/analyzer.py  analysis pipeline (link + audio)
│           ├── trending/youtube.py        trending tracks + curated fallback
│           ├── comparison/compare.py      multi-track comparison + fit scoring
│           ├── audio/processor.py         audio file utilities
│           └── persistence/db.py          SQLite CRUD
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

## Environment variables

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

The frontend proxies `/api/*` to the backend via Next.js rewrites — no CORS issues in development.

---

## License

MIT
