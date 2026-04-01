---
name: urmw-project
description: Project details for URMW App (YouTube to Telegram Music Downloader & Player)
---

# URMW App (YouTube to Telegram Music Downloader & Player)

This skill contains the core architectural and implementation details for the URMW application.

## Overview

The URMW App is a web-based music application that allows users to search for music on YouTube, download it to a Telegram channel/chat, and stream it back through a custom player.

## Pages

### 1. Home Page (`/`)
- Purpose: Displays the list of songs that have been previously downloaded.
- Data Source: Fetches metadata from Supabase.

### 2. Search Page (`/search`)
- Purpose: Search for music on YouTube.
- Functionality:
  - Hits the backend search endpoint to get the top 10 results.
  - Each result has a "Download" button.
  - Clicking "Download" triggers the backend processing.

### 3. Player Page (`/player`)
- Purpose: An expanded version of the mini-player for a full-screen listening experience.
- Features: Playback controls, progress bar, metadata display.

### 4. Mini Player
- Purpose: A persistent player component that follows the user across pages.
- Streaming: Audio is streamed directly via a service URI provided by the backend.

## Backend Architecture

- **API Base URL**: `https://ytm-to-tele-production.up.railway.app/`
- **Endpoints**:
  - `POST /search`: Searches YouTube for a given title/query. Returns the top 10 results.
  - `POST /process`: Initiates the download and upload process to Telegram.
- **Storage**:
- **Songs**: Uploaded and hosted on Telegram.
- **Metadata**: Stored in Supabase for quick retrieval and listing in the UI.

## Database Schema (Supabase)

Table: `videos`

The metadata for each song is stored in Supabase with the following fields:

- `videoId`: (text) The unique YouTube video identifier.
- `title`: (text) The title of the song/video.
- `artist`: (text) The name of the artist/channel.
- `duration`: (int4) The length of the track in seconds.
- `fileId`: (text) The unique Telegram file identifier used for streaming.
- `createdAt`: (timestamptz) Record creation time.

## Streaming Mechanism

Streaming is handled through a Cloudflare Worker that proxies content from Telegram.

- **Stream URL**: `https://urmw-stream.anotheralltimehigh.workers.dev/?id=[fileId]`
- **Usage**: The `MiniPlayer.tsx` uses this URL structure to provide audio to the user.

## Environment Variables

The project requires the following environment variables to be configured:

- `TELEGRAM_BOT_TOKEN`: The token for the Telegram bot.
- `TELEGRAM_CHAT_ID`: The ID of the Telegram chat where music is stored.
- `API_ACCESS_KEY`: Access key for the backend API.
- `SUPABASE_URL`: The URL of the Supabase project.
- `SUPABASE_KEY`: The public/service key for Supabase.

## Implementation Notes

- **Aesthetics**: The app should use a premium, dynamic design with dark mode, smooth transitions, and rich micro-animations.
- **Framework**: Built with Next.js (Note: APIs and conventions may differ from standard training data; refer to `node_modules/next/dist/docs/` if needed).
- **Styling**: Vanilla CSS is preferred for custom aesthetics and flexibility.
