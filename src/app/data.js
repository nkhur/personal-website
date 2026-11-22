// All site content lives here. Edit freely — the components just render this.
// Source of truth: public/resume.pdf (updated Nov 2026).

export const profile = {
  name: 'Navya Khurana',
  words: ['data', 'ai', 'interaction', 'whatever’s interesting'],
  tagline:
    'i mess around with data, ai, and whatever tech feels interesting — and explore a little design on the side.',
  lede: 'i like building tools that make life better, not just faster — and interfaces that make tech feel alive.',
  notes: [
    'i’m finishing a computer science degree (with a math minor) at umd in december 2026. lately that’s meant clinical decision-support research at uc davis health, a summer at visa, and ai agents on the side.',
    "outside of code i'm usually deep in a playlist, swapping music recs with friends, or losing at mario kart.",
  ],
  credits: [
    ['studying', 'computer science + math @ umd · dec 2026'],
    ['currently', 'research software engineer @ uc davis health'],
    ['this summer', 'software engineer intern @ visa'],
    ['on repeat', 'whatever a friend just sent me'],
    ['also', 'mario kart (badly)'],
  ],
  email: 'nkhurana@umd.edu',
  github: 'https://github.com/nkhur',
  linkedin: 'https://linkedin.com/in/navya-khurana',
  resume: '/resume.pdf',
};

// Atlas nodes, in chronological order (oldest first). `pos` = [x%, y%] on the map;
// keep x increasing so the map reads left to right in time.
export const atlas = [
  {
    id: 'shah',
    title: 'Shah Lab',
    role: 'Systems & Software Researcher · UMD',
    when: 'Feb — Sep 2024',
    start: 'Feb 2024',
    end: 'Sep 2024',
    pos: [10, 80],
    color: '#4fe3ff',
    art: { kind: 'neural', dx: 150, dy: -150 },
    blurb: 'Closed-loop brain stimulation for Parkinson’s research, in UMD’s ECE department.',
    points: [
      'Built a Python control system for recording, stimulation and visualization across 32 channels.',
      'Added SPI-driven FPGA pattern loading, enabling further research in the lab.',
    ],
    stack: ['Python', 'SPI', 'FPGA'],
  },
  {
    id: 'passionfruit',
    title: 'Passionfruit',
    role: 'Software Engineer Intern · New York, NY',
    when: 'Jul — Sep 2024',
    start: 'Jul 2024',
    end: 'Sep 2024',
    pos: [26, 22],
    color: '#ffa24a',
    art: { kind: 'seo', dx: -40, dy: 140 },
    blurb: 'A startup backed by Stanford and CMU, building SEO tooling for marketing teams.',
    points: [
      'Raised CTR and time on page by 15–20% across 12+ clients with a Performance Analytics Chatbot: it analyzed 18 months of MongoDB campaign data, found action–impact relationships with linear regression, and delivered LLM-augmented recommendations.',
      'Developed a Topical Authority Scorer that gives client content a quantitative SEO relevance score, cutting manual SEO review by 20+ hours. Used YAKE + BERT keyword extraction, cosine similarity of text embeddings, and LLM-based evaluation.',
    ],
    stack: ['MongoDB', 'Python', 'BERT', 'YAKE', 'LLMs'],
  },
  {
    id: 'del',
    title: 'Digital Engagement Lab',
    role: 'Applied ML Researcher · UMD',
    when: 'Mar — Jun 2025',
    start: 'Mar 2025',
    end: 'Jun 2025',
    pos: [42, 68],
    color: '#ff5fc8',
    art: { kind: 'news', dx: 30, dy: -160 },
    blurb: 'Reimagining how young audiences engage with political and news content through data, AI and interaction design.',
    points: [
      'Built data ingestion and transformation pipelines to quantify viewer–content alignment across 1000+ videos, analyzing 1M+ YouTube comments with PyTorch classifiers to find engagement patterns.',
    ],
    stack: ['Python', 'PyTorch', 'YouTube data'],
  },
  {
    id: 'ucdavis',
    title: 'UC Davis Health',
    role: 'Research Software Engineer · Sacramento, CA',
    when: 'Aug 2025 — now',
    start: 'Aug 2025',
    end: 'present',
    pos: [58, 18],
    color: '#ff6a5a',
    art: { kind: 'health', dx: -20, dy: 150 },
    blurb: 'Working directly with Dr. Simon Benjamin Ascher on hypertension management.',
    points: [
      'Built an Epic EHR–integrated React.js clinical decision-support tool that models personalized hypertension benefit–risk tradeoffs with Bayesian analysis. Kaiser Permanente, UCSF and UCSD have confirmed it for pilot evaluation.',
      'Formalized the Bayesian risk model in R, trained and tested on SPRINT trial data (9,316 enrolled). Leading the first-author manuscript.',
    ],
    stack: ['React', 'Epic EHR', 'R', 'Bayesian analysis'],
  },
  {
    id: 'h4i',
    title: 'Hack4Impact',
    role: 'Developer · For All Ages (non-profit)',
    when: 'Sep 2025 — May 2026',
    start: 'Sep 2025',
    end: 'May 2026',
    pos: [74, 78],
    color: '#8f8bff',
    art: { kind: 'impact', dx: -20, dy: -150 },
    blurb: 'An ML-driven profile-matching system that connects senior citizens with volunteers, to reduce social isolation.',
    points: [
      'Built the rematching data pipeline: pulled low-score pairs from Firebase, generated embeddings and upserted them into Pinecone.',
      'Integrated a new Express REST API layer to support the frontend workflows.',
    ],
    stack: ['Firebase', 'Express', 'Node.js', 'React', 'Pinecone'],
  },
  {
    id: 'visa',
    title: 'Visa',
    role: 'Software Engineer Intern · Austin, TX',
    when: 'Jun — Aug 2026',
    start: 'Jun 2026',
    end: 'Aug 2026',
    pos: [90, 24],
    color: '#ffd84a',
    art: { kind: 'payments', dx: -40, dy: 150 },
    blurb: 'Built a full-stack Spring Boot + React platform that automates SSH-driven payment-processing workflows for a new settlement system and 12 payment gateways.',
    points: [
      'Cut an operator workflow from 8+ manual steps to 3, taking task time from 20 minutes to under a minute for ~500+ internal users.',
      'Halved job execution time by replacing single-threaded SSH with thread-pooled async workers and custom completion signaling, and moving job storage from an in-memory ConcurrentHashMap to H2.',
    ],
    stack: ['Spring Boot', 'React', 'Java', 'H2'],
  },
];
export const atlasStart = 0; // which node is selected on load (0 = the earliest)

export const projects = [
  {
    title: 'CodeCanvas',
    sub: 'visual scratchpads for llm code agents',
    year: 'Fall 2025',
    kind: 'codemap',
    blurb:
      'Co-built (team of 3) an LLM coding agent that reasons over a rendered visual codemap of a repo (Tree-sitter graph, Leiden clusters) plus cached memory, via MCP tools. On 7 Terminal-Bench 2.0 tasks against text-only and LocAgent baselines: 50% fewer backtracks (1.57 vs 3.14), 72% fewer hallucinations, 6% lower cost.',
    stack: ['Python', 'Tree-sitter', 'MCP'],
  },
  {
    title: 'Remi',
    sub: 'hackprinceton fall 2025',
    year: 'Fall 2025',
    kind: 'agenda',
    blurb:
      'An intelligent meeting and voice assistant that orchestrates meeting analysis, email drafting and calendar events across Google Workspace to give a personalized daily overview. An automated agenda-tracking and suggestion pipeline sits on a Neo4j knowledge graph of task dependencies and context.',
    stack: ['Electron.js', 'Python', 'Supabase', 'Neo4j', 'Render', 'ElevenLabs', 'Gemini'],
  },
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
    title: 'a first-author paper',
    text: 'writing up the bayesian hypertension benefit–risk model, trained and tested on SPRINT trial data (9,316 enrolled).',
  },
  {
    status: 'in progress',
    title: 'from model to clinic',
    text: 'the epic-integrated decision-support tool has been confirmed by kaiser permanente, ucsf and ucsd for pilot evaluation.',
  },
  {
    status: 'experiment',
    title: 'agents that can see',
    text: 'codecanvas teaches a coding agent to read a repo as a picture, not just text: fewer backtracks, fewer hallucinations.',
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
  {
    id: 'languages',
    label: 'languages',
    items: ['JavaScript', 'TypeScript', 'Java', 'Python', 'Rust', 'C/C++', 'OpenMP', 'MPI', 'CUDA', 'R', 'HTML/CSS'],
  },
  {
    id: 'frameworks',
    label: 'frameworks',
    items: ['Spring Boot', 'React', 'Node.js', 'Next.js', 'Express', 'Electron.js', 'JUnit', 'Flask', 'Puppeteer'],
  },
  {
    id: 'infra',
    label: 'databases + infra',
    items: ['Postgres', 'MongoDB', 'Firebase', 'Supabase', 'Docker', 'Jenkins', 'Render', 'Git', 'Figma'],
  },
  {
    id: 'ai',
    label: 'ai / ml',
    items: ['PyTorch', 'CLIP', 'OpenCV', 'scikit-learn', 'pandas', 'OpenAI API', 'Gemini API', 'Pinecone', 'RAG'],
  },
];
