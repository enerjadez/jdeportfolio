# JDE — A Showcase of Magic

A portfolio drawn **live by math**. No images, no video, no frameworks, no build
step — every act is an equation running in your browser on Canvas 2D.

**Live:** https://enerjadez.github.io/jdeportfolio/

## The idea: a deck of cards

Each page is its own separate little world — a **card**. The site is a **deck**:
a sticky stack of full-screen cards that fold away as you scroll. Cards come
from the creative world and get added to the deck over time.

```
index.html            the shell — head, chrome, one <script> line per card
css/site.css          tokens, chrome, and one theme class per card
js/engine.js          the deck runtime (build, clock, fold, boot, cursor)
js/cards/NN-name.js   one file = one card = one world
```

The engine only animates the 1–2 cards actually visible, sizes every canvas for
device pixel ratio, and isolates failures — a card that throws is disabled
alone, the rest of the deck keeps playing.

## The deck

| Act | Card | The math |
|-----|------|----------|
| 01 | Ignition | fbm value-noise ascii fluid, cursor pours heat |
| 02 | The Machine | parametric turbine blades + streamline airflow |
| 03 | The Launch | 12 s countdown → ignition → ascent → orbit |
| 04 | The Singularity | Kepler disk ω ∝ r^-3/2, lensing, doppler beaming |
| 05 | The Source | fbm vector field, golden spawn point, pulse rings |
| 06 | The Great Wave | traveling sines; foam solved from sin(kx−ωt)=1 |
| 07 | The Rain | glyph rain that parts around your hand |
| 08 | The Observer | a blueprint eye that watches you + live telemetry |
| 09 | CMR Africa | five elements as an orbiting geometric lattice |
| 10 | The Constellation | orbits, trails, a comet — comms channel |
| ~~ | The Signal | layered sine ribbons, the carrier wave outro |

## Add a card to the deck

1. Create `js/cards/12-mycard.js`:

```js
(()=>{
const {P,fbm,MOBILE}=JDE;   // shared pointer, noise, flags

JDE.card({
  id:'mycard',              // #mycard — deep-linkable
  act:'11',                 // tab + frame-index label
  tab:'My Card',
  theme:'pmycard',          // css class for the section
  nav:'Mine',               // optional top-nav link
  every:1,                  // optional: draw every Nth frame
  html:`
    <p class="eyebrow">What this world is</p>
    <h2 class="display">A new little world.</h2>`,
  draw(ctx,w,h,t,card){
    // your equations here — 60fps, ctx is pre-scaled for DPR
  },
});
})();
```

2. Add its theme colors to `css/site.css`:

```css
.pmycard{background:#101018;color:#eee}
.pmycard .panel-tab{border-color:rgba(255,255,255,.15)}
```

3. Add one line to `index.html` where you want it in the deck:

```html
<script src="js/cards/12-mycard.js"></script>
```

That's it. The engine builds the section, canvas, tab, frame-index dot and nav
link for you.

## Run locally

```
npm run dev     # npx serve . -l 3000
```

or just open `index.html` — no build, no bundler, plain scripts.

## Deploy

Static files, root of the repo. GitHub Pages serves `main` (`.nojekyll`
included); `vercel.json` is set up if Vercel is preferred.

## License

MIT · engines by hand, physics by math, magic by both.
