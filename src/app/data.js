// All site content lives here. Edit freely — the components just render this.
// NOTE: dates/roles are carried over from the previous version of the site.
// Anything newer than Sept 2025 still needs to be added by you.

export const profile = {
  name: 'Navya Khurana',
  words: ['data', 'ai', 'interaction', 'whatever’s interesting'],
  tagline:
    'i mess around with data, ai, and whatever tech feels interesting — and explore a little design on the side.',
  lede: 'i like building tools that make life better, not just faster — and interfaces that make tech feel alive.',
  notes: [
    'right now that means clinical software at uc davis health, ai + news research at umd, and a lot of curiosity in between.',
    "outside of code i'm usually deep in a playlist, swapping music recs with friends, or losing at mario kart.",
  ],
  credits: [
    ['studying', 'computer science @ umd'],
    ['currently', 'epic smart on fhir app @ uc davis health'],
    ['on repeat', 'whatever a friend just sent me'],
    ['also', 'mario kart (badly)'],
  ],
  email: 'nkhurana@umd.edu',
  github: 'https://github.com/nkhur',
  linkedin: 'https://linkedin.com/in/navya-khurana',
};

// Atlas nodes, in chronological order. `pos` = [x%, y%] on the map.
// Relationships between nodes are computed from shared `stack` entries.
export const atlas = [
  {
    id: 'shah',
    title: 'Shah Lab',
    role: 'Undergraduate Researcher · UMD ECE',
    when: 'Feb — Sep 2024',
    pos: [11, 66],
    blurb:
      "A neural interface for restoring motor control in Parkinson's patients with closed-loop brain stimulation. I helped deliver the end-to-end system for real-time stimulation, recording and visualization.",
    points: [
      'Python GUI that decodes neural signals to and from the Intan RHS 2000 board and streams them into OpenEphys, with user-defined alerts for matching patterns.',
      'Live stimulation: triggers outputs based on incoming signal characteristics for closed-loop experiments.',
      'Wrote SPI command interpreters that generate .coe files for loading stimulation patterns onto the board.',
    ],
    stack: ['Python', 'SPI', 'OpenEphys'],
  },
  {
    id: 'passionfruit',
    title: 'Passionfruit',
    role: 'Software Engineer Intern · NYC',
    when: 'Jul — Sep 2024',
    pos: [30, 28],
    blurb:
      'Startup backed by Stanford, StartX and CMU. Built ML + backend features marketing teams use to generate, evaluate and optimize SEO content at scale.',
    points: [
      'Content ideas generator: scraped "People Also Ask" and top-ranking blog structure to auto-build LLM prompts.',
      'Topical authority scorer: YAKE + BERT keywords and embedding cosine similarity to score how on-topic a post is.',
      'Analytics chatbot: linear regression over historical site metrics to tie changes to specific SEO tasks.',
      'Content editor: live keyword scoring, autosave and GPT rewrite suggestions.',
    ],
    stack: ['Node.js', 'Next.js', 'Python', 'OpenAI', 'MongoDB'],
  },
  {
    id: 'del',
    title: 'Digital Engagement Lab',
    role: 'Undergraduate Researcher · UMD',
    when: 'Mar — Jun 2025',
    pos: [50, 68],
    blurb:
      'Reimagining how young audiences engage with political and news content through data, AI, and interaction design.',
    points: [
      'Audience sentiment: pulled video metadata and every comment through the YouTube Data API, then ran HuggingFace emotion + semantic models on comments, titles and transcripts to compare viewer sentiment with video intent.',
      "New View News: the lab's AI-enhanced news reader. Wired in PostHog (heatmaps, click frequency, session replays) for event-level UX research, and started integrating news-story-viz for narrative visual summaries.",
    ],
    link: { label: 'new view news', href: 'https://smart-story-agent.vercel.app/' },
    stack: ['Python', 'Pandas', 'PyTorch', 'HuggingFace', 'TypeScript', 'PostHog'],
  },
  {
    id: 'ucdavis',
    title: 'UC Davis Health',
    role: 'Undergraduate Researcher',
    when: 'Aug 2025 — now',
    pos: [71, 30],
    blurb:
      'Leading end-to-end development of an Epic SMART on FHIR app that lets clinicians personalize blood-pressure targets — and helps clinicians and patients see benefit–risk tradeoffs from real-time data.',
    points: [],
    stack: ['SMART on FHIR', 'Epic', 'TypeScript', 'Next.js'],
  },
  {
    id: 'h4i',
    title: 'Hack4Impact UMD',
    role: 'Developer · For All Ages',
    when: 'Sep 2025 — now',
    pos: [89, 62],
    blurb: 'Building tools for the non-profit For All Ages, alongside a team and Microsoft mentors.',
    points: [],
    stack: ['Firebase', 'Express', 'React', 'Node.js'],
  },
];
export const atlasStart = 3; // which node is selected on load

export const projects = [
  {
    title: 'Professor Rating Predictor',
    sub: 'machine learning · planetterp',
    year: '2025',
    kind: 'scatter',
    blurb:
      'Random forest, KNN and ridge regression models that predict a UMD professor’s rating from PlanetTerp data. 10-fold cross-validation, up to 75.8% R² on held-out data.',
    stack: ['Python', 'pandas', 'scikit-learn'],
  },
  {
    title: 'MicroCaml',
    sub: 'language implementation',
    year: '2024',
    kind: 'tree',
    blurb:
      'A lexer, parser, optimizer, type checker and interpreter for a small OCaml-inspired language with lexical scoping, recursion and let bindings.',
    stack: ['OCaml'],
  },
  {
    title: 'Shell',
    sub: 'systems',
    year: '2024',
    kind: 'pipes',
    blurb: 'A Unix-style shell with &&, pipes, redirection and subshells, built on a command tree and child processes.',
    stack: ['C'],
  },
  {
    title: 'Maze Solver',
    sub: 'graphs',
    year: '2023',
    kind: 'maze',
    blurb:
      'Models a maze as a weighted graph; finds solutions with BFS and DFS and the best path with Dijkstra’s. Comes with a GUI.',
    stack: ['Java'],
  },
  {
    title: 'SafeSites',
    sub: 'data app',
    year: '2023',
    kind: 'map',
    blurb: 'Ranks Airbnb listings by neighborhood crime rating and your needs (kids, pets…), safest first.',
    stack: ['Python', 'Streamlit'],
  },
];

// The studio: process, experiments, unfinished things.
export const studio = [
  {
    status: 'in progress',
    title: 'turning news into visual stories',
    text: 'integrating the open-source news-story-viz tool into New View News, so an article can become a narrative visual summary.',
  },
  {
    status: 'in progress',
    title: 'benefit–risk, made visible',
    text: 'iterating on how a clinician and a patient should see blood-pressure tradeoffs side by side, from live data.',
  },
  {
    status: 'experiment',
    title: 'a background you can steer',
    text: 'earlier versions of this site let your hand shape the visuals with MediaPipe. it’s still here, just optional now.',
    action: 'hand',
    actionLabel: 'try the camera',
  },
];

export const skillGroups = [
  { id: 'languages', label: 'languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'OCaml'] },
  {
    id: 'ai',
    label: 'ai + data',
    items: ['PyTorch', 'HuggingFace', 'scikit-learn', 'pandas', 'OpenAI API', 'BERT', 'embeddings', 'regression'],
  },
  {
    id: 'web',
    label: 'web',
    items: ['Next.js', 'React', 'Node.js', 'Express', 'Firebase', 'MongoDB', 'Streamlit'],
  },
  {
    id: 'systems',
    label: 'health + systems',
    items: ['SMART on FHIR', 'Epic', 'PostHog', 'YouTube API', 'MediaPipe', 'SPI', 'OpenEphys'],
  },
];
