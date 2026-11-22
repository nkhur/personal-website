// All site content lives here. Edit freely — the components just render this.
// Source of truth: public/resume.pdf (updated Nov 2026).

export const profile = {
  name: 'Navya Khurana',
  tagline: '',
  lede: 'i’m a cs and math student at umd, graduating in december 2026.',
  notes: [
    'i enjoy building projects, tinkering with new ideas, and keeping up with developments in cs and ai. i like reading papers and digging through codebases to understand how things work in practice. i’m drawn to technically ambiguous problems and enjoy working with people who are genuinely excited about what they’re building. outside of tech, i enjoy music, the gym, and finding new things to get into.',
    'say hi!',
  ],
  credits: [
    ['currently', 'research software engineer @ uc davis health'],
    ['previously', 'software engineer intern @ visa · summer 2026'],
    ['interested in', 'software, ai, and research'],
  ],
  email: 'nkhurana@umd.edu',
  github: 'https://github.com/nkhur',
  linkedin: 'https://linkedin.com/in/navya-khurana',
  resume: '/resume.pdf',
};

// Atlas nodes, in chronological order (oldest first). Each sits on the race circuit (see
// buildTrack in atlasArt.js); `art.dx/dy` place its drawing relative to its stop.
export const atlas = [
  {
    id: 'shah',
    title: 'Shah Lab',
    role: 'Systems & Software Researcher · UMD',
    when: 'Feb — Sep 2024',
    start: 'Feb 2024',
    end: 'Sep 2024',
    color: '#4fe3ff',
    art: { kind: 'neural', dx: 192, dy: -20 },
    blurb: 'Built the software behind a closed-loop brain-stimulation rig for Parkinson’s research: live recording, stimulation and visualization across 32 channels.',
    points: [
      'Python control system covering recording, stimulation and visualization.',
      'SPI-driven FPGA pattern loading, enabling further research in the lab.',
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
    color: '#ffa24a',
    art: { kind: 'seo', dx: 192, dy: -20 },
    blurb: 'Shipped two ML features at an SEO startup: a chatbot that lifted client CTR and time on page 15–20%, and a scorer that cut manual SEO review by 20+ hours.',
    points: [
      'Performance Analytics Chatbot, live across 12+ clients: analyzed 18 months of MongoDB campaign data, found action–impact relationships with linear regression, and delivered LLM-augmented recommendations to repeat what worked using each client’s current metrics.',
      'Topical Authority Scorer: quantitative SEO relevance scores for client content, using YAKE + BERT keyword extraction, cosine similarity of text embeddings, and LLM-based evaluation.',
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
    color: '#ff5fc8',
    art: { kind: 'news', dx: 192, dy: -20 },
    blurb: 'Built the pipelines and PyTorch classifiers that measured how well 1000+ YouTube videos matched viewer reactions across 1M+ comments.',
    points: [
      'The lab’s mission: reimagine how young audiences engage with political and news content through data, AI and interaction design.',
      'Built data ingestion and transformation pipelines to quantify viewer–content alignment and surface engagement patterns.',
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
    color: '#ff6a5a',
    art: { kind: 'health', dx: -192, dy: -20 },
    labelLeft: true,
    blurb: 'Built an Epic-integrated tool that shows clinicians a patient’s personalized hypertension benefit–risk tradeoff; confirmed for pilot evaluation at Kaiser Permanente, UCSF and UCSD.',
    highlight: {
      short: 'first-author paper',
      label: 'first-author paper',
      text: 'In progress: I’m leading the manuscript on the Bayesian benefit–risk model behind the tool.',
    },
    points: [
      'React.js clinical decision-support tool integrated with the Epic EHR, modeling benefit–risk tradeoffs with Bayesian analysis.',
      'Formalized the Bayesian risk model in R, trained and tested on SPRINT trial data (9,316 enrolled).',
      'Working directly with Dr. Simon Benjamin Ascher.',
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
    color: '#8f8bff',
    art: { kind: 'impact', dx: 192, dy: -20 },
    blurb: 'Built the rematching pipeline for an ML system that pairs senior citizens with volunteers to reduce social isolation.',
    points: [
      'Pulled low-score pairs from Firebase, then generated embeddings and upserted them into Pinecone.',
      'Integrated a new Express REST API layer to support frontend workflows.',
    ],
    link: { label: 'github', href: 'https://github.com/Hack4Impact-UMD/for-all-ages' },
    stack: ['Firebase', 'Express', 'Node.js', 'React', 'Pinecone'],
  },
  {
    id: 'visa',
    title: 'Visa',
    role: 'Software Engineer Intern · Austin, TX',
    when: 'Jun — Aug 2026',
    start: 'Jun 2026',
    end: 'Aug 2026',
    color: '#ffd84a',
    art: { kind: 'payments', dx: -192, dy: -20 },
    labelLeft: true,
    blurb: 'Built a Spring Boot + React platform that automates payment-processing workflows for 12 gateways, cutting a 20-minute, 8+ step task to a minute or less for ~500+ internal users.',
    points: [
      'Full-stack platform automating SSH-driven workflows for a new settlement system and 12 payment gateways; operators went from 8+ manual steps to 3.',
      'Halved job execution time: replaced single-threaded SSH with thread-pooled async workers and custom completion signaling, and moved job storage from an in-memory ConcurrentHashMap to H2.',
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
    link: { label: 'devpost', href: 'https://devpost.com/software/remi-x2vb91' },
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
    status: 'ongoing',
    title: 'a first-author paper',
    text: 'writing up the bayesian hypertension benefit–risk model, trained and tested on SPRINT trial data (9,316 enrolled).',
  },
  {
    status: 'ongoing',
    title: 'from model to clinic',
    text: 'the epic-integrated decision-support tool has been confirmed by kaiser permanente, ucsf and ucsd for pilot evaluation.',
  },
  {
    status: 'experiment',
    title: 'a background you can conduct',
    text: 'turn on the camera and your hand conducts the background: point to pick a chord, move up and down the staff, pinch to add notes, tilt to bend them.',
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
