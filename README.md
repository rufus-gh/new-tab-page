# New Tab Page

A simple custom browser new tab page built with Vite.

## Features

- Random Unsplash background
- Slash commands in the search bar:
	- `/yt` — YouTube search
	- `/gh` — GitHub repository search
	- `/chat` — ChatGPT query
	- `/duck` — DuckDuckGo search
- Default search falls back to Google
- Local weather based on your location

## Setup

1. Install dependencies: `npm install`
2. Add `VITE_UNSPLASH_ACCESS_KEY` to a `.env` file
3. Start the app: `npm run dev`

## Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run preview` — preview the build