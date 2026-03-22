# BeatMap

AI-powered music intelligence engine that converts song links or live mic audio into timestamped scene-fit insights, tailored to the creator's specific video type.

## Architecture

**Frontend** — Next.js 16 + React 19 + TypeScript + Tailwind 4, served on port 5000.  
**Backend** — FastAPI + Python 3.12, served on port 8000. Frontend proxies `/api/*` to backend via Next.js rewrites.

```
frontend/
  src/app/
    page.tsx                main client page (preset selector, compare toggle, trending)
    globals.css
    layout.tsx
  src/components/
    analysis-result.tsx     full result dashboard (best cuts, shot plan, voiceover, scene fits)
    best-cuts-section.tsx   15s / 30s / 45s best windows with confidence bars
    shot-plan-section.tsx   step-by-step cut plan for the selected edit type
    preset-selector.tsx     15-type edit preset grid (Reel, TikTok, Gym, etc.)
    trending-section.tsx    live trending tracks by language (8 languages)
    compare-tracks.tsx      side-by-side multi-track comparison panel
    link-input-form.tsx     URL input + submit
    recorder.tsx            mic recording (MediaRecorder API)
    creature-showcase.tsx   animated AI character carousel (producer, cyberdj etc.)
    hero-background.tsx     gradient blob background
    marquee-strip.tsx       scrolling banner
    scrolling-cards.tsx     animated three-column card showcase
    empty-state.tsx         pre-analysis hint
    recent-analyses.tsx     history panel
    result-card.tsx         generic card wrapper
    section-header.tsx      utility heading
  src/types/
    analysis.ts             all TypeScript types (SongAnalysisResult, BestCut, ShotPlanStep,
                            TrendingTrack, CompareResponse, EditPreset, PRESET_OPTIONS)
  src/lib/
    api.ts                  typed API client (analyzeSongLink, analyzeAudio,
                            fetchTrending, compareTrackLinks)
    formatters.ts           scene category label helper
    platform.ts             platform display name helper

backend/
  app/main.py               FastAPI app + CORS + lifespan
  app/settings.py           centralised config (env vars)
  app/api/
    routes.py               API routes (analyze link, analyze audio, trending, compare, CRUD)
    schemas.py              Pydantic models (all request + response types)
    link_utils.py           platform detection
    youtube_utils.py        YouTube video ID extraction
    soundcloud_utils.py     SoundCloud path extraction
  app/services/
    gemini/
      client.py             Groq (primary) + Gemini (fallback) AI clients
                            - PRESET_CONTEXT dict (15 preset-aware system prompts)
                            - ANALYSIS_SCHEMA (bestCuts, shotPlan, upgraded voiceover)
    metadata/
      youtube.py            YouTube Data API v3 client
      soundcloud.py         SoundCloud oEmbed client
    orchestration/
      analyzer.py           staged pipeline: metadata → AI → normalise → persist
    trending/
      youtube.py            YouTube trending music API + curated fallback (8 languages)
    comparison/
      compare.py            multi-track analysis orchestrator + fit scoring
    audio/
      processor.py          audio file utilities
    persistence/
      db.py                 SQLite CRUD (analyses table, with preset column)
```

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/health` | Health check |
| `POST` | `/api/analyze/link` | YouTube or SoundCloud URL + preset → SongAnalysisResult |
| `POST` | `/api/analyze/audio` | Multipart audio upload + preset → SongAnalysisResult |
| `GET`  | `/api/trending` | Live or curated trending tracks by language |
| `POST` | `/api/compare` | Compare 2–3 songs side-by-side for an edit type |
| `GET`  | `/api/analyses` | List recent analyses (max 20) |
| `GET`  | `/api/analyses/{id}` | Full analysis by ID |
| `DELETE` | `/api/analyses/{id}` | Delete analysis |

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 — metadata + trending tracks |
| `GROQ_API_KEY` | Groq (primary AI, Llama-3.3-70b) — fast scene analysis |
| `GEMINI_API_KEY` | Google Gemini (fallback AI + audio analysis) |

## Features

- **Edit-Type Presets** — 15 creator-context presets shape all AI recommendations
- **Best Cut Generator** — 15s / 30s / 45s optimal windows with confidence scores
- **Shot Plan** — 5–7 step sequential cut plan for the selected video type
- **Upgraded Voiceover** — `great / okay / risky` safety levels with plain-English reasons
- **Trending Tracks** — 8 language tabs; live YouTube API with curated fallback
- **Track Comparison** — analyse 2–3 songs and get a ranked fit score + winner

## Analysis Modes

- `metadata_only` — YouTube/SoundCloud link; AI reasons from song knowledge + metadata
- `recorded_audio` — mic/upload; Gemini analyses the actual audio via Files API

## AI Providers

- **Groq** (primary) — `llama-3.3-70b-versatile`, fast, preset-aware prompts
- **Gemini Flash Lite** (fallback) — for both metadata and audio analysis
- Graceful degradation: if both fail, honest placeholder returned (never silent)

## Database

SQLite at `beatmap.db` (configurable via `DB_PATH` env var). Auto-created + migrated on startup. Includes `preset` column.

## Workflows

- **Start application** — `cd frontend && npm run dev` (port 5000, webview)
- **Backend API** — `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
