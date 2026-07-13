# JDE Portfolio

A live, math-driven portfolio showcase — no images, no video. Every scene is drawn in real time with canvas and equations.

**Live site:** [enerjadez.github.io/jdeportfolio](https://enerjadez.github.io/jdeportfolio/)

## Acts

| # | Scene | Technique |
|---|--------|-----------|
| 01 | Ignition | ASCII fluid field + cursor heat |
| 02 | The Machine | Parametric turbine + airflow particles |
| 03 | The Launch | Full countdown → ignition → ascent cycle |
| 04 | The Singularity | Kepler disk, lensing, tidal stream |
| 05 | The Source | fBm flow field + pulse rings |
| 06 | The Great Wave | Traveling sine swells (after Hokusai) |
| 07 | The Rain | Glyph rain that parts around your hand |
| 08 | The Observer | Blueprint eye + live telemetry |
| 09 | The Constellation | Orbits, links, comet |
| ~~ | The Signal | Carrier-wave ribbons |

## Performance

Built to stay smooth on desktop and mobile:

- **Adaptive quality** — particle counts, DPR, and frame skip scale with device class (`saveData`, cores, memory, coarse pointer)
- **Visibility-aware** — canvases animate only while on screen; all loops pause when the tab is hidden
- **Mobile-first layout** — safe-area insets, 44px+ tap targets, `100dvh` panels, landscape phone tweaks
- **Reduced motion** — respects `prefers-reduced-motion` (static layout, no boot sequence)
- **Scroll thrift** — rAF-throttled progress bar; card-fold transforms disabled on mobile Safari

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy (GitHub Pages)

This repo is configured for GitHub Pages from the `main` branch root.

Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.

## Customize

- Brand / name: search for `JDE` in `index.html`
- Email: `enerjadezn@gmail.com`
- GitHub: [github.com/enerjadez](https://github.com/enerjadez)

## License

© 2026 JDE · engines by hand, physics by math, magic by both.
