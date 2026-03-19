# BeatMap

BeatMap is an AI-powered music intelligence engine that converts song links or live audio into timestamped scene-fit insights, hook detection, voiceover-safe sections, and creative-use recommendations.

## Abstract

BeatMap is designed as a portfolio-grade full-stack AI project that goes beyond simple music recognition. Instead of only identifying a song, BeatMap answers a more useful creative question:

**Where can this song be used effectively in content?**

Given a song link or live microphone input, BeatMap generates a structured analysis that helps creators, editors, marketers, and storytellers understand:

- where the best hook moment occurs
- which sections are safer for voiceover
- how the energy and mood change over time
- what creative scenarios the song fits best
- which alternative tracks offer a similar direction

The long-term goal is to combine:

- frontend audio interaction
- backend analysis APIs
- agent-based orchestration
- MCP-compatible tool integration
- real metadata extraction
- AI reasoning for music structure

## Current Status

BeatMap is currently in early development.

The project already includes:

- Next.js frontend
- FastAPI backend
- structured analysis models
- mock analysis dashboard
- platform detection for links
- YouTube and SoundCloud link parsing
- real YouTube metadata fetching
- thumbnail support for YouTube links
- API endpoint for link analysis

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- Pydantic
- Uvicorn
- HTTPX
- python-dotenv

### Planned AI Layer

- Google Gemini API
- Google ADK
- MCP tools

## Repository Structure

```txt
beatmap/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── link_utils.py
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   ├── soundcloud_utils.py
│   │   │   ├── youtube_client.py
│   │   │   ├── youtube_schemas.py
│   │   │   └── youtube_utils.py
│   │   ├── main.py
│   │   └── settings.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
└── README.md

Development Progress
Day 1

Project setup and core architecture.

Repository

Created GitHub repository

Added README

Added gitignore

Added MIT license

Frontend

Created Next.js project

Added Tailwind CSS

Built homepage UI

Created reusable UI components

Added analysis result types

Created mock analysis data

Built analysis dashboard

Backend

Created FastAPI backend

Added /health endpoint

Added Pydantic schemas

Created /api/analyze/link endpoint

Connected backend routes

Added placeholder analysis response

Day 2

Added the first part of the link intelligence pipeline.

Platform Detection

BeatMap now detects the platform from a pasted music link.

Supported platforms:

YouTube

SoundCloud

Unknown

Implementation:

backend/app/api/link_utils.py
YouTube Link Parsing

BeatMap can now extract the video ID from YouTube links.

Supported formats:

youtube.com/watch?v=VIDEO_ID
youtu.be/VIDEO_ID

Implementation:

backend/app/api/youtube_utils.py

Example:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

Extracted:

dQw4w9WgXcQ
SoundCloud Link Parsing

BeatMap can now extract the artist/track path from SoundCloud links.

Example:

https://soundcloud.com/forss/flickermood

Extracted:

forss/flickermood

Implementation:

backend/app/api/soundcloud_utils.py
API Improvements

The backend API now returns platform-specific identifiers.

Example response:

{
  "platform": "youtube",
  "youtubeVideoId": "dQw4w9WgXcQ"
}
Day 3

Connected real YouTube metadata fetching.

Environment Setup

Added backend settings and environment variable loading for YouTube API access.

Files added/updated:

backend/app/settings.py
backend/.env.example
backend/.env
YouTube Metadata Fetching

BeatMap now fetches real YouTube metadata using the YouTube Data API.

It currently pulls:

video title

channel title

thumbnail URL

Files added:

backend/app/api/youtube_schemas.py
backend/app/api/youtube_client.py
Route Integration

The link analysis route now:

detects YouTube links

extracts the video ID

calls the YouTube Data API

returns real song title, artist/channel, and thumbnail URL

Updated file:

backend/app/api/routes.py
Frontend Type and Mock Updates

Added thumbnail support to the shared analysis type and updated mock data.

Updated files:

frontend/src/types/analysis.ts
frontend/src/lib/mock-analysis.ts
UI Improvement

The analysis dashboard now shows a thumbnail preview for a track when available.

Updated file:

frontend/src/app/page.tsx
Verified Working Response

Example working response:

{
  "songTitle": "Nee Gunde Lona Video Song | Dude| Pradeep R, Mamitha Baiju |  @SaiAbhyankkar  |Jonita |Keerthiswaran",
  "artistName": "Think Music Telugu",
  "source": "link",
  "sourceLabel": "youtube.com/watch?v=d3Vnu_tsYPA",
  "platform": "youtube",
  "youtubeVideoId": "d3Vnu_tsYPA",
  "soundcloudPath": null,
  "thumbnailUrl": "https://i.ytimg.com/vi/d3Vnu_tsYPA/hqdefault.jpg"
}
Current Behavior

When a link is submitted:

Backend detects platform

Extracts platform-specific identifiers

Fetches real YouTube metadata for YouTube links

Generates placeholder scene analysis

Returns structured analysis JSON

The frontend is ready to consume real analysis data, and YouTube links now return live title, channel, and thumbnail values.

Local Development
Run Frontend
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000
Run Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs
API
Health
GET /health
Analyze Link
POST /api/analyze/link

Example request:

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
Next Steps

Next milestones:

Connect frontend link input to the backend endpoint

Show real API results in the frontend instead of mock data

Add error/loading states for analysis requests

Add SoundCloud metadata support

Add Gemini-based analysis

Implement mic audio input

Build agent pipeline

Vision

BeatMap aims to be a standout AI + full-stack portfolio project demonstrating:

modern frontend architecture

typed backend APIs

multimodal input design

link intelligence pipelines

agent-based AI orchestration

explainable creative AI outputs

License

MIT
