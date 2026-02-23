# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start        # Start development server
yarn test         # Run tests (interactive watch mode)
yarn test --watchAll=false  # Run tests once (CI mode)
yarn build        # Production build
```

No separate lint command — ESLint runs automatically via `react-scripts` during `yarn start` and `yarn build`. ESLint config is in `package.json` under `"eslintConfig"`, extending `"react-app"` and `"react-app/jest"`.

## Architecture

This is a Create React App (React 17, class components) single-page app that displays Jewish prayer times (zmanim) for a given location.

**Data flow:**
1. `App.js` detects the user's location (browser Geolocation API or zip code from `SearchBox`)
2. A zip code is resolved to coordinates via the Google Maps Timezone API
3. Coordinates + current date are sent to the [Hebcal Zmanim API](https://www.hebcal.com/zmanim) to fetch prayer times
4. `processTimes()` in `App.js` filters and relabels the raw API response fields into human-readable names (e.g., `alotHaShachar` → "Alos HaShachar")
5. The times array is passed down: `App` → `PanelList` → `Panel` (one card per time)

**Component responsibilities:**
- `src/containers/App.js` — All state and API logic lives here. `componentDidMount` triggers geolocation; `componentDidUpdate` re-fetches when location/date changes.
- `src/components/SearchBox.js` — Controlled input; calls `App`'s lookup function on change.
- `src/components/PanelList.js` — Maps times array to `Panel` cards.
- `src/components/Panel.js` — Stateless display card for a single zmanim entry.

**Styling:** [Tachyons](https://tachyons.io/) utility classes applied directly in JSX. Global background gradient is in `src/index.css`.

**External APIs:**
- `https://maps.googleapis.com/maps/api/timezone/json` — Converts coordinates to timezone offset; API key is currently hardcoded in `App.js`.
- `https://www.hebcal.com/zmanim` — Returns prayer times given lat/lng, tzid, and date.
