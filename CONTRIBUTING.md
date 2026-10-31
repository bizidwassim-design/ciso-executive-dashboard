# Contributing

Thanks for helping make executive security reporting a little less painful.

## Good contributions

* A new tile or chart that answers a question a board actually asks (say which one in the PR).
* Better defaults: colour contrast, chart readability, print layout, mobile layout.
* Translations of the UI strings (keep `index.html` as the English reference; add `index.<lang>.html`).
* Bug fixes and accessibility improvements.

## Rules of the road

1. Keep it dependency-light: plain HTML/CSS/JS, Chart.js only. No build step, no framework, no analytics.
2. Everything renders from `data/metrics.js`; a new chart must read from that object, with a documented key in the README table.
3. Colours go through the CSS tokens in `assets/style.css` so both themes keep working.
4. Sample data stays **fictional**. Never commit real company figures, names or domains.
5. Test in a Chromium browser and Firefox, light and dark, phone width and desktop.

## Process

Open an issue for anything bigger than a small fix, then a pull request with a short description and a screenshot.
By contributing you agree your work is released under the [MIT License](LICENSE) and you accept the
[Code of Conduct](CODE_OF_CONDUCT.md).
