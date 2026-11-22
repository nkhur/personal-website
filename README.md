<h1 align="center">
  navyakhurana.vercel.app - v2
</h1>

<p align="center">a personal site shaped like an album: an overture, liner notes, a map of where i've worked drawn on a real race circuit, and a tracklist of things i've made. it's quiet music you can see, with an optional camera mode that lets your hand conduct the background.</p>

> **v1** (Material UI tabs + a Three.js particle wave) is still in the git history at commit [`2da5513`](https://github.com/nkhur/personal-website/commit/2da5513).

## what's on the site

| section | url | what it is |
| --- | --- | --- |
| intro | `/` | the name, one line, and the background |
| about | `/about` | a short intro, a few facts, and links (email, github, linkedin, resume) |
| skills | `/skills` | filterable skill chips grouped by languages, frameworks, databases + infra, ai / ml |
| experiences | `/experiences` | six stops on the **Suzuka circuit**, in time order from left to right, each with a line drawing of the work, start and end dates, and details |
| projects | `/projects` | a tracklist; every project has its own generated sketch and, where there is one, an icon link (GitHub, Devpost) next to its name |
| in progress | `/in-progress` | what's ongoing, plus the camera experiment |

- **URLs follow the scroll.** Each section has its own address that updates as you scroll, and opening one jumps straight to it.
- **Light and dark.** The site opens in whatever your device is set to; the sun/moon button in the nav switches it and remembers your choice on that browser.
- **Responsive.** Checked at phone, tablet and desktop widths; the experiences map scrolls sideways on narrow screens and keeps the selected stop in view.

### the background

A single fixed `<canvas>` (`components/Atmosphere.js`) draws a quiet piece of music:

- a **grand staff** (treble + bass) that bobs gently; scrolling ripples it
- **chords** of noteheads riding the staff, with a different voicing per section, plus a playhead that follows your scroll position
- an ambient **equalizer** along the bottom and a turning **vinyl record** in the corner
- the colour palette changes with the section (and has a light variant)

### camera mode (optional)

Off by default: nothing loads and no camera prompt appears until you press the button in the bottom-right corner. Then [MediaPipe's HandLandmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) runs in the browser and your hand conducts the chords:

- **index finger**: left to right picks the chord, up and down moves the notes along the staff
- **pinch**: closed fingers squeeze the chord together, open ones spread it wide (and add or remove notes)
- **tilt**: bends the notes

Video never leaves your device. The model and WASM are fetched from a CDN the first time you turn it on. It needs `localhost` or HTTPS.

## tech stack

- **Next.js 14** (App Router) and **React 18**: one page served at several addresses via an optional catch-all route (`app/[[...section]]`)
- **Framer Motion**: reveals, expanding rows and cross-fades
- **MediaPipe Tasks Vision**: hand tracking
- **Canvas 2D and SVG**: the background, the circuit and all the drawings (no charting or UI library)
- **Plain CSS** with theme tokens in `globals.css`; fonts are Instrument Serif, Inter Tight and JetBrains Mono from Google Fonts

## run it locally

```bash
git clone https://github.com/nkhur/personal-website.git
cd personal-website

npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

Run one dev server at a time: two of them sharing the same `.next` folder fight over its cache and cause hydration errors and Fast Refresh reloads.

## editing the content

Nearly all the text lives in **`src/app/data.js`**:

| export | what it controls |
| --- | --- |
| `profile` | name, tagline, the about text, the fact rows, email and links |
| `atlas` | the six experiences (see below) |
| `projects` | the tracklist |
| `studio` | the "in progress" cards |
| `skillGroups` | the skill chips |

The resume is `public/resume.pdf`.

**Links.** Give a project or experience a `link: { label: 'github', href: 'https://…' }` and a small icon (the site's logo for GitHub and Devpost, an arrow otherwise) appears beside its name.

**A project's sketch.** Each project has a `kind`, which picks its sketch in `components/Previews.js`. To add a project, add its entry to `projects`, then either reuse an existing `kind` or draw a new one and register it in `KINDS` at the bottom of that file.

**An experience.** Each has a colour, a drawing (`art: { kind, dx, dy }`, drawn in `atlasArt.js`) and a spot on the circuit. The stops are the indices in `CIRCUIT_STOPS` at the bottom of `src/app/circuitTrack.js`: the first sits at the left-most point and the last at the right-most. `art.dx` and `art.dy` nudge the drawing relative to its stop; `labelLeft: true` puts the label on the left of the star. Adding or removing an experience means adjusting `CIRCUIT_STOPS` to match.

## project layout

```
src/app
├── [[...section]]/page.js   one page, several addresses (/about, /skills, …)
├── Home.js                  composes the page
├── layout.js                fonts, metadata, and the pre-paint theme script
├── globals.css              theme tokens (dark and light) and all styling
├── data.js                  all of the content
├── atlasArt.js              the line drawings for each experience, the sky and the car
├── circuitTrack.js          Suzuka circuit data (see credits) and the stop positions
├── rng.js                   a tiny seeded random generator so the art never changes
└── components
    ├── Atmosphere.js        the music background
    ├── HandControl.js       opt-in camera and hand tracking
    ├── Nav.js               top bar, scroll-synced URLs
    ├── ThemeToggle.js       light/dark switch
    ├── Hero.js, LinerNotes.js, Skills.js, Atlas.js, Tracklist.js, Studio.js
    ├── Previews.js          the project sketches
    ├── IconLink.js          icon links beside names
    ├── Playhead.js          the "now playing" readout
    └── Reveal.js            scroll-in animation
```

## credits

- **Suzuka circuit**: track geometry from [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits) (`jp-1962.geojson`), MIT licence, © 2019–2025 Tomislav Bacinger. Projected, rotated and scaled for the map.
- **Design inspiration**: [anvv.tech](https://anvv.tech/) for the clean, structured layout, and [aahana-surya.github.io](https://aahana-surya.github.io/) for a background that changes as you scroll and a playful experience section.
- **Hand tracking**: [MediaPipe](https://developers.google.com/mediapipe).
