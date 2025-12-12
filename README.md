# ASOIAF Classic Puzzle (Classic Mode)
A LoLdle-style daily puzzle for A Song of Ice and Fire characters (Classic mode).

## Files
- `index.html` — frontend UI
- `style.css` — styles & animations
- `script.js` — frontend game logic
- `data/characters.json` — character database (edit to add your characters)
- `api/today.js` — returns metadata for today's puzzle (date, attributes, maxAttempts)
- `api/validate.js` — validates a guess and returns per-category feedback

## Local development
1. Install Vercel CLI: `npm install -g vercel`
2. Run locally: `vercel dev`
3. Open `http://localhost:3000`

## Deployment
Push this repository to GitHub and import it to Vercel. The site will be available at `https://<your-project>.vercel.app`.
