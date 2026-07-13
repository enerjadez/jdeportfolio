# JDE Portfolio

A live, math-driven portfolio showcase — no images, no video. Every scene is drawn in real time with canvas and equations.

**Live site:** [enerjadez.github.io/jdeportfolio](https://enerjadez.github.io/jdeportfolio/)

## Acts

| # | Scene | Technique |
|---|--------|-----------|
| 01 | Ignition | ASCII fluid field + cursor heat |
| 02 | The Machine | Parametric turbine + angular-momentum airflow |
| 03 | The Launch | Countdown → ignition → ascent (alt ∝ t²) |
| 04 | The Singularity | Kepler disk ω ∝ r⁻³⁄², lensing, tidal stream |
| 05 | The Source | fBm flow field + pulse rings + vortex |
| 06 | The Great Wave | Traveling sines after Hokusai |
| 07 | The Rain | Glyph rain that parts around your hand |
| 08 | The Observer | Blueprint eye + live telemetry |
| 09 | **CMR Africa · Elements** | Five elements of insight as living geometric lattice |
| 10 | The Constellation | Orbits, links, comet |
| ~~ | The Signal | Carrier-wave ribbons |

### Featured: CMR Africa

[Act 09](https://cmrafrica.com/) is a commissioned-style showcase for **Creative Market Research Africa** — Earth, Fire, Water, Air, and Aether woven as African-inspired geometric market art. Culture becomes signal.

## Desktop fix notes

Earlier builds broke desktop sticky stacks by transforming `position: sticky` nodes and using `contain: paint` / `desynchronized` canvases. This build:

- Transforms only `.panel-stage` (never the sticky `.panel`)
- Avoids CSS paint containment on sticky cards
- Uses plain `getContext('2d')` (no desynchronized)
- Sizes canvases from parent `getBoundingClientRect`
- Never applies `max-width` to canvas bitmaps

## Run locally

Open `index.html` in a browser, or:

```bash
python -m http.server 8080
```

## License

© 2026 JDE · engines by hand, physics by math, magic by both.
