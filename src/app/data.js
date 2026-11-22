// All site content lives here. Edit freely — the components just render this.
// NOTE: dates/roles are carried over from the previous version of the site.
// Anything newer than Sept 2025 still needs to be added by you.

export const profile = {
  name: 'Navya Khurana',
  tagline:
    'i mess around with data, ai, and whatever tech feels interesting — and explore a little design on the side.',
  about: [
    'i like building tools that make life better, not just faster — and interfaces that make tech feel alive.',
    'right now that means clinical software at uc davis health, ai + news research at umd, and a lot of curiosity in between.',
    "outside of code i'm usually deep in a playlist, swapping music recs with friends, or losing at mario kart.",
  ],
  facts: [
    ['studying', 'computer science @ umd'],
    ['building', 'epic smart on fhir app'],
    ['listening to', 'whatever a friend just sent me'],
    ['playing', 'mario kart (badly)'],
  ],
  email: 'nkhurana@umd.edu',
  github: 'https://github.com/nkhur',
  linkedin: 'https://linkedin.com/in/navya-khurana',
};

export const experience = [
  {
    org: 'UC Davis Health',
    role: 'Undergraduate Researcher',
    when: 'Aug 2025 — now',
    blurb:
      'Leading end-to-end development of an Epic SMART on FHIR app that lets clinicians personalize blood-pressure targets — and helps clinicians and patients see benefit–risk tradeoffs from real-time data.',
    points: [],
    stack: ['SMART on FHIR', 'Epic', 'TypeScript', 'Next.js'],
  },
  {
    org: 'Digital Engagement Lab',
    role: 'Undergraduate Researcher · UMD',
    when: 'Mar — Jun 2025',
    blurb:
      "Reimagining how young audiences engage with political and news content through data, AI, and interaction design.",
    points: [
      'Audience sentiment: pulled video metadata and every comment through the YouTube Data API, then ran HuggingFace emotion + semantic models on comments, titles and transcripts to compare viewer sentiment with video intent.',
      "New View News: the lab's AI-enhanced news reader. Wired in PostHog (heatmaps, click frequency, session replays) for event-level UX research, and started integrating news-story-viz for narrative visual summaries.",
    ],
    link: { label: 'new view news', href: 'https://smart-story-agent.vercel.app/' },
    stack: ['Python', 'Pandas', 'PyTorch', 'HuggingFace', 'TypeScript', 'PostHog'],
  },
  {
    org: 'Passionfruit',
    role: 'Software Engineer Intern · NYC',
    when: 'Jul — Sep 2024',
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
    org: 'Shah Lab',
    role: 'Undergraduate Researcher · UMD ECE',
    when: 'Feb — Sep 2024',
    blurb:
      "A neural interface for restoring motor control in Parkinson's patients with closed-loop brain stimulation. I helped deliver the end-to-end system for real-time stimulation, recording and visualization.",
    points: [
      'Python GUI that decodes neural signals to and from the Intan RHS 2000 board and streams them into OpenEphys, with user-defined alerts for matching patterns.',
      'Live stimulation: triggers outputs based on incoming signal characteristics for closed-loop experiments.',
      'Wrote SPI command interpreters that generate .coe files for loading stimulation patterns onto the board.',
    ],
    stack: ['Python', 'SPI', 'OpenEphys'],
  },
];

export const projects = [
  {
    title: 'For All Ages',
    sub: 'Hack4Impact-UMD',
    year: '2025 —',
    blurb: 'Building tools for the non-profit For All Ages, alongside a team and Microsoft mentors.',
    stack: ['Firebase', 'Express', 'React', 'Node.js'],
    big: true,
  },
  {
    title: 'Professor Rating Predictor',
    sub: 'ML · PlanetTerp',
    year: '2025',
    blurb:
      'Random forest, KNN and ridge regression models that predict a UMD professor’s rating from PlanetTerp data. 10-fold cross-validation, up to 75.8% R² on held-out data.',
    stack: ['Python', 'pandas', 'scikit-learn'],
    big: true,
  },
  {
    title: 'MicroCaml',
    sub: 'language implementation',
    year: '2024',
    blurb:
      'A lexer, parser, optimizer, type checker and interpreter for a small OCaml-inspired language with lexical scoping, recursion and let bindings.',
    stack: ['OCaml'],
  },
  {
    title: 'Shell',
    sub: 'systems',
    year: '2024',
    blurb: 'A Unix-style shell with &&, pipes, redirection and subshells, built on a command tree and child processes.',
    stack: ['C'],
  },
  {
    title: 'Maze Solver',
    sub: 'graphs',
    year: '2023',
    blurb: 'Models a maze as a weighted graph; finds solutions with BFS and DFS and the best path with Dijkstra’s. Comes with a GUI.',
    stack: ['Java'],
  },
  {
    title: 'SafeSites',
    sub: 'data app',
    year: '2023',
    blurb: 'Ranks Airbnb listings by neighborhood crime rating and your needs (kids, pets…), safest first.',
    stack: ['Python', 'Streamlit'],
  },
];

export const skillGroups = [
  {
    id: 'languages',
    label: 'languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'OCaml'],
  },
  {
    id: 'ai',
    label: 'ai + data',
    items: ['PyTorch', 'HuggingFace', 'scikit-learn', 'pandas', 'OpenAI API', 'BERT', 'embeddings', 'regression'],
  },
  {
    id: 'web',
    label: 'web',
    items: ['Next.js', 'React', 'Node.js', 'Express', 'Firebase', 'MongoDB', 'Streamlit', 'three.js'],
  },
  {
    id: 'systems',
    label: 'health + systems',
    items: ['SMART on FHIR', 'Epic', 'PostHog', 'YouTube API', 'MediaPipe', 'SPI', 'OpenEphys'],
  },
];
