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
  email: 'nknavyakhurana@gmail.com',
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
      'Worked with Professor Sahil Shah (ECE) at UMD toward future clinical experiments for the lab.',
      'Custom Python GUI that decodes and displays neural signals to and from the Intan RHS 2000 board, streamed as binary into OpenEphys for real-time visualization, with user-defined alerts for matching patterns.',
      'Live stimulation: triggers outputs based on incoming signal characteristics, for immediate response in closed-loop experiments.',
      'SPI command interpreters that generate .coe files for loading experimental stimulation patterns onto the FPGA, enabling further research in the lab.',
      'Supported researchers with custom firmware patches and documentation for smooth lab adoption.',
    ],
    stack: ['Python', 'SPI', 'FPGA', 'OpenEphys'],
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
      'Owned and built client-facing full-stack ML and NLP tools in Python, Node.js and Next.js. Learned on the job and shipped in a fast-paced startup.',
      'Chatbot: linear regression over 18 months of MongoDB campaign data found which actions moved results, and an LLM recommended how to repeat them with each client’s current metrics.',
      'Scorer: rates how on-topic a client’s content is, using YAKE + BERT keywords, embedding cosine similarity and LLM evaluation.',
      'Content ideas generator: scraped Google’s “People Also Ask” questions and the structure of top-ranking blogs (word count, hyperlink density, image use) to auto-generate LLM prompts for content ideation.',
      'Content editor: live keyword scoring, autosave and GPT rewrite suggestions to improve on-page SEO.',
    ],
    stack: ['Python', 'Node.js', 'Next.js', 'MongoDB', 'BERT', 'YAKE', 'OpenAI'],
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
      'Built data ingestion and transformation pipelines to quantify viewer–content alignment and surface engagement patterns.',
      'Analyzed millions of comments with PyTorch classifiers to build a “viewer–content alignment” metric for videos, pulling structured metadata and comments from the YouTube Data API and adding HuggingFace emotion and semantic models for comments, titles and transcripts.',
      'New View News: the lab’s scannable AI news platform for instant high-level insights. Built core features, added PostHog (cursor heatmaps, click frequency, session replays) for event-level UX research, and integrated the open-source news-story-viz tool for narrative visual summaries.',
    ],
    link: { label: 'new view news', href: 'https://smart-story-agent.vercel.app/' },
    stack: ['Python', 'PyTorch', 'HuggingFace', 'Next.js', 'PostHog'],
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
      'React.js clinical decision-support tool integrated with the Epic EHR (SMART on FHIR), modeling benefit–risk tradeoffs with Bayesian analysis.',
      'Interactive charts (Chart.js) that help clinicians and patients visualize the tradeoffs and make decisions.',
      'Formalized the Bayesian risk model in R, trained and tested on SPRINT trial data (9,316 enrolled).',
      'Working directly with Dr. Simon Benjamin Ascher.',
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'Chart.js', 'Epic EHR', 'SMART on FHIR', 'R', 'Bayesian analysis'],
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
      'Collaborated with a cross-functional team and Microsoft mentors in an agile SDLC environment.',
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
      'Co-built (team of 3) a multimodal LLM coding agent that reasons over a rendered visual codemap of a repo (Tree-sitter graph, Leiden clusters) plus cached memory, via MCP tools. On 7 Terminal-Bench 2.0 tasks against text-only and LocAgent baselines: 50% fewer backtracks (1.57 vs 3.14), 72% fewer hallucinations, 33% fewer hypotheses, 6% lower cost. Co-authored the research paper.',
    stack: ['Python', 'Tree-sitter', 'MCP', 'Docker'],
  },
  {
    title: 'Remi',
    sub: 'hackprinceton fall 2025',
    year: 'Fall 2025',
    kind: 'agenda',
    blurb:
      'An intelligent meeting and voice assistant that orchestrates meeting analysis, email drafting and calendar events across Google Workspace to give a personalized daily overview. An automated agenda-tracking and suggestion pipeline sits on a Neo4j knowledge graph of task dependencies and context. Built with AI-assisted rapid prototyping (Copilot, Claude).',
    stack: ['Electron.js', 'Python', 'Supabase', 'Neo4j', 'Render', 'ElevenLabs', 'Gemini'],
    link: { label: 'devpost', href: 'https://devpost.com/software/remi-x2vb91' },
  },
  {
    title: 'TrueView',
    sub: 'bias detection interview platform',
    year: 'Nov 2025',
    kind: 'interview',
    blurb:
      'Built at Gemini Hack Night: a production-ready MVP in under 8 hours, with real-time transcription, performance and bias scoring, an HR analytics dashboard and a meeting platform. Whisper and Gemini analyze video, audio and transcript together, and AI-assisted rapid prototyping kept iteration fast.',
    stack: ['Python', 'Next.js', 'Flask', 'Render', 'Whisper', 'Gemini'],
    link: { label: 'devpost', href: 'https://devpost.com/software/trueview-26g784' },
  },
  {
    title: 'Aestoria',
    sub: 'personalized ml image curation',
    year: 'Aug 2025 — paused',
    kind: 'curate',
    blurb:
      'A CLIP-based pipeline that embeds a user’s style from Instagram and Pinterest by vibe and quality, then sequences photos with learned aesthetic transitions and graph search.',
    stack: ['PyTorch', 'Next.js', 'MongoDB'],
  },
  {
    title: 'Time Series Forecasting',
    sub: 'class attendance + weather',
    year: 'May 2025',
    kind: 'forecast',
    blurb:
      'Applied ARIMA and ARIMAX models to study how weather relates to class attendance, tuning parameters with ACF/PACF and Dickey-Fuller stationarity tests and validating the findings with Pearson, Spearman and t-tests.',
    stack: ['Python'],
  },
  {
    title: 'Professor Rating Predictor',
    sub: 'machine learning · planetterp',
    year: 'Apr 2025',
    kind: 'scatter',
    blurb:
      'Random forest, KNN and ridge regression models that predict a UMD professor’s rating from PlanetTerp data (think ratemyprof for UMD). 10-fold cross-validation, up to 75.8% R² on held-out data.',
    stack: ['Python', 'pandas', 'scikit-learn'],
  },
  {
    title: 'Garbage Collectors in Rust',
    sub: 'systems',
    year: 'Fall 2024',
    kind: 'heap',
    blurb:
      'Implemented reference-counting, mark-and-sweep and stop-and-copy garbage collectors in safe Rust, managing heap allocation, stack roots, pointer updating, cycles and fragmentation on a Vec-based memory simulation.',
    stack: ['Rust', 'Systems programming', 'Memory management'],
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
    year: 'Mar 2024',
    kind: 'pipes',
    blurb: 'A Unix-style shell in C with command parsing, redirection, pipes and subshells, built on a command tree and child processes.',
    stack: ['C'],
  },
  {
    title: 'Maze Solver',
    sub: 'graphs',
    year: 'Nov 2023',
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
