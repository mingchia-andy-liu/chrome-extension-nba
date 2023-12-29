<p align="center">
  <img src="build/assets/png/icon-2-color-128.png">
  <br>
  Chrome Web Store:
  <br>
  <a href="https://chromewebstore.google.com/detail/basketball-box-scores/mfmkedeaebcckihpinmhkadoagdbifaa">
    <img src="https://img.shields.io/chrome-web-store/v/mfmkedeaebcckihpinmhkadoagdbifaa?label=version" alt="Chrome web store version">
  </a>
  <a href="https://chromewebstore.google.com/detail/basketball-box-scores/mfmkedeaebcckihpinmhkadoagdbifaa">
    <img src="https://img.shields.io/chrome-web-store/stars/mfmkedeaebcckihpinmhkadoagdbifaa?label=rating" alt="Chrome web store rating">
  </a>
  <a href="https://chromewebstore.google.com/detail/basketball-box-scores/mfmkedeaebcckihpinmhkadoagdbifaa">
    <img src="https://img.shields.io/chrome-web-store/users/mfmkedeaebcckihpinmhkadoagdbifaa?label=users" alt="Chrome web store users">
  </a>
  <br>
  Firefox:
  <br>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/basketball-box-scores">
    <img src="https://img.shields.io/amo/v/basketball-box-scores?label=version" alt="Firefox version">
  </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/basketball-box-scores">
    <img src="https://img.shields.io/amo/stars/basketball-box-scores?label=rating" alt="Firefox rating">
    </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/basketball-box-scores">
    <img src="https://img.shields.io/amo/users/basketball-box-scores?label=users" alt="Firefox users">
  </a>
  <br>
</p>

# Basketball Box Scores Extension

The best NBA browser extension!

## Get Basketball Box Scores Extension

- [Chrome](https://chrome.google.com/webstore/detail/box-scores/mfmkedeaebcckihpinmhkadoagdbifaa)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/basketball-box-scores)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/basketball-box-scores/jfjpbnfbngccdnnbaiggbphfbmciiokg)

## Screenshots
<details close>
<summary>Click me to see.</summary>
<div style="display:flex;flex-direction:column;">
<h4>Boxscores overview with a highlight video</h4>
<img width="50%" src="screenshots/box_score_overview.png">
<h4>Boxscores player stats</h4>
<img width="50%" src="screenshots/box_score_player_stats.png">
<h4>Dark mode 🌙</h4>
<img width="50%" src="screenshots/box_score_player_stats_dark_mode.png">
<h4>standings</h4>
<img width="50%" src="screenshots/standings.png">
<h4>Playoff view</h4>
<img width="50%" src="screenshots/playoff.png">
</div>
</details>

## Motivation

Sports websites don't usually have a convenient way to find out the latest box score.
This extension is for people who just want to get the latest update but too lazy to look it up.

## Features
- [x] Daily box score on the popup page
- [x] Highlight Videos from YouTube
- [x] Dark mode
- [x] Add favorite team
- [x] Add favorite players
- [x] Playoff bracket for each season
- [x] Standings
- [x] Notifications

## Roadmap
- [ ] Add the ability to sort tables

---

## Dev start notes

### Prerequisite
You need to have `npm` installed.

### Running locally
- Run `./build.sh`. A new zip should be created under the `/dist`

**Firefox**
- Load the zip file into Firefox

**Chrome** (Chrome cannot load zip as extension locally)
- Load the `build` folder into Chrome

#### Third party packages
* `react-flatpickr`
* `moment-timezone`
