# JDE Portfolio — drawn live by math

**Live:** [enerjadez.github.io/jdeportfolio](https://enerjadez.github.io/jdeportfolio/)

Sticky-card showcase. Every scene is canvas math (plus optional Three.js). No images, no video files.

## How it stays smooth

- **One active panel** per frame (center hit-test) — buried cards do not draw
- **No `transform` on `position: sticky`** — that pattern breaks desktop stacking
- **30fps cap**, mid/eco quality, `DPR` capped at 1
- Boot screen always dismisses (click / 2s failsafe)

## Acts

| # | Scene | Engine |
|---|--------|--------|
| 01 | Ignition | ASCII fluid + cursor heat |
| 02 | The Fan | Dual-stage turbine + airflow |
| 03 | Launch | Interactive Newtonian rocket |
| 04 | Singularity | Three.js accretion (2D fallback) |
| 05 | **Garden of Life** | L-system trees, fireflies, sacred geometry |
| 06 | Fourier Sea | Three.js interference field |
| 07 | **The Matrix** | Glyph rain that parts around your hand |
| 08 | Code Corridor | Perspective matrix walls |
| 09 | Sacred Breath | φ mandala pulse |
| 10 | Observer | Eye + live telemetry |
| 11 | CMR Africa | Element lattice |
| 12 | Constellation | Orbits + comet |
| ~~ | Signal | Carrier waves |

## Local

```bash
npx serve . -l 3000
```

Open `index.html` directly also works for Canvas 2D scenes.

## License

MIT · engines by hand, physics by math, magic by both.
