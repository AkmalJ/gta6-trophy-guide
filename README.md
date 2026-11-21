# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/AkmalJ/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/AkmalJ/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An entry for the make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01): a fully offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI.

## What is inside

- **All 55 of 55 official trophies** — every name, description and grade shown exactly as PlayStation publishes them (official list dated 2026-11-18): 1 platinum, 2 gold, 6 silver, 46 bronze.
- **A written guide for every trophy**, in our own words, and **every guide cites its sources** (the official PlayStation trophy list, the PSNProfiles and PowerPyx trophy guides and roadmaps, PlayStationTrophies.org). No specific claim — a count, a chapter, a step — is made without a source behind it.
- **A six-stage platinum roadmap** built from the official descriptions: (1) story playthrough, (2) strangers & side strands, (3) collectibles & exploration, (4) activities & challenges, (5) free-roam feats, crime & cash, (6) 100% completion and the platinum.
- **3 missable trophies flagged in red**, each with its earn-by window drawn from its official description: Catch Me If You Can (the story's VCIA visit), Actions Speak Louder (choices across the story) and Bad Luck, I Guess (fail once, then succeed — set it up early). There is also a dedicated Missables view.
- **Kinds:** 13 story, 32 activities, 7 collectibles, 3 missable — and the official list contains **no online trophies**, so the online filter honestly reports that.

## The tracker

- Tick trophies off; progress is **saved in the browser** (localStorage) and survives reloads.
- **Export progress to a JSON file and import it back** on any machine.
- **Filters** by kind (story / missable / collectibles / activities / online), by grade, by earned state, plus full-text search across names, descriptions and guides.
- **Spoiler shield:** hide the names and descriptions of story trophies until you have earned them.
- A progress header with a platinum-progress ring and per-grade counts that updates live.

## Run it

The app is plain static files under `app/` — no build step, no network requests at run time.

```sh
node serve.ts          # serves app/ at http://localhost:8080
# or serve the app/ folder with any static file server and open index.html
```

`node main.ts` (with `MAKEFUN_OUTPUT_DIR` set outside the grader) copies `app/` and `screenshots/` and writes the entry's `dossier.json`.

Trophy data lives in `app/data/trophies.json`: the official `name`, `description` and `grade` fields are verbatim from PlayStation's list; `kind`, `missable`, `stage`, `guide`, `sources` (and `earnBy` for missables) are this entry's own work.

This is a fan-made guide and tracker. It is not affiliated with Rockstar Games or PlayStation, and it uses no Rockstar artwork, logos or game screenshots.
