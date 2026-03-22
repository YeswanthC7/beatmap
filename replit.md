# BeatMap

AI-powered music intelligence engine that converts song links or live mic audio into timestamped scene-fit insights.

## Architecture

**Frontend** — Next.js 16 + React 19 + TypeScript + Tailwind 4, served on port 5000.  
**Backend** — FastAPI + Python 3.12, served on port 8000. Frontend proxies `/api/*` to backend via Next.js rewrites.

```
frontend/       Next.js app
  src/app/      page.tsx (main client page), layout, globals.css
  src/components/
    analysis-result.tsx   full result dashboard
    link-input-form.tsx   URL input + submit
    recorder.tsx          mic recording (MediaRecorder API)
    empty-state.tsx       pre-analysis placeholder
    recent-analyses.tsx   history panel
    result-card.tsx       generic card wrapper
    section-header.tsx    page hero

backend/
  app/main.py             FastAPI app + CORS + lifespan
  app/settings.py         centralised config (env vars)
  app/api/
    routes.py             thin API routes
    schemas.py            Pydantic models (request + response)
    link_utils.py         platform detection
    youtube_utils.py      YouTube video ID extraction
    soundcloud_utils.py   SoundCloud path extraction
  app/services/
    metadata/
      youtube.py          YouTube Data API v3 client
      soundcloud.py       SoundCloud oEmbed client (no key needed)
    gemini/
      client.py           google-genai SDK wrapper (graceful degradation)
    orchestration/
      analyzer.py         staged pipeline: metadata → AI → persist
    audio/
      processor.py        audio file utilities
    persistence/
      db.py               SQLite CRUD (analyses table)
```

## API Endpoints

- `GET  /health`
- `POST /api/analyze/link`   — YouTube or SoundCloud URL → SongAnalysisResult
- `POST /api/analyze/audio`  — multipart audio upload → SongAnalysisResult
- `GET  /api/analyses`       — list recent analyses (max 20)
- `GET  /api/analyses/{id}`  — get full analysis by ID
- `DELETE /api/analyses/{id}` — delete analysis

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 — metadata fetch |
| `GEMINI_API_KEY` | Google Gemini AI — scene analysis generation |

## Analysis Modes

- `metadata_only` — YouTube/SoundCloud link; Gemini analyses based on known song knowledge
- `recorded_audio` — mic/upload; Gemini analyses the actual audio file via Files API

## Gemini Degradation

If `GEMINI_API_KEY` is missing or quota is exhausted, the backend returns honest placeholder analysis (clearly labelled, never misleading) and still fetches real metadata.

## Database

SQLite at `beatmap.db` (configurable via `DB_PATH` env var). Auto-created on startup.

## Workflows

- **Start application** — `cd frontend && npm run dev` (port 5000, webview)
- **Backend API** — `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` (port 8000, console)
