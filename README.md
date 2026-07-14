# A Showcase of Magic

**Live site:** [enerjadez.github.io/jdeportfolio](https://enerjadez.github.io/jdeportfolio/)

A sticky-card portfolio of pure browser art — no images, no video. Every scene is drawn live with canvas, noise, and physics.

## Acts

| # | Scene | Technique |
|---|--------|-----------|
| 01 | **Ignition** | ASCII fluid field + cursor heat + text scramble |
| 02 | **The Machine** | Parametric turbine + angular-momentum airflow |
| 03 | **The Launch** | Countdown → ignition → ascent (alt ∝ t²) |
| 04 | **The Singularity** | Kepler disk ω ∝ r⁻³⁄², lensing, tidal stream |
| 05 | **The Source** | fBm flow field + pulse rings + vortex |
| 06 | **The Great Wave** | Traveling sines after Hokusai |
| 07 | **The Prism** | RGB refraction through a glass wedge |
| 08 | **The Rain** | Glyph rain that parts around your hand |
| 09 | **The Observer** | Blueprint eye + live telemetry of *you* |
| 10 | **The Lattice** | Isometric cube city that tilts with the pointer |
| 11 | **The Constellation** | Orbits, links, comet |
| ~~ | **The Signal** | Carrier-wave ribbons |

## Stack

- Single `index.html` — zero build step
- Canvas 2D only (no WebGL required)
- IntersectionObserver — scenes idle off-screen
- `prefers-reduced-motion` respected
- Hosted on **GitHub Pages** (`main` / root)

## Local

```bash
npx serve . -l 3000
# or just open index.html
```

## License

MIT · engines by hand, physics by math, magic by both.
