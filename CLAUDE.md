# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A standalone Apple Watch app (watchOS 10+, SwiftUI) that displays Jewish prayer times (zmanim) for the user's current location.

## Architecture

**Data flow:**
1. `LocationManager` requests GPS coordinates via CoreLocation
2. If location is unavailable after 10 seconds, the user is prompted for a zip code
3. Coordinates or zip code are sent to the [Hebcal Zmanim API](https://www.hebcal.com/zmanim)
4. `ZmanimService` parses the response and maps API keys to human-readable labels
5. `ContentView` displays the result as a scrollable list of time entries

**Files:**
- `Zmanim Watch App/ZmanimApp.swift` — `@main` app entry point
- `ContentView.swift` — root view, state machine (locating → loading → loaded/zipEntry/error)
- `ZmanimRow.swift` — single row displaying a label and time
- `ZmanimService.swift` — Hebcal API fetch; supports coordinates or zip code
- `LocationManager.swift` — CoreLocation wrapper using `@Observable`
- `ZmanimEntry.swift` — data model for a single zmanim entry

**Build:**
Open `Zmanim.xcodeproj` in Xcode. Select a watchOS simulator or paired Apple Watch and hit ⌘R.

**External API:**
`https://www.hebcal.com/zmanim` — accepts `latitude`/`longitude`/`tzid` or `zip`, returns prayer times as ISO datetime strings.
