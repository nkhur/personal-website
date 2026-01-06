import '@/styles/pages.css'

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function ProjectPage() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <div>
      <h2>\ projects</h2>
    </div>
     
    <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection:'column',
          width: '100%',
          padding: '2rem',
          borderRadius: '12px',
        }}
      >
        <Tabs selectionFollowsFocus 
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: 'white',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '15px',
              textTransform: 'none'
            },
            '& .Mui-selected': {
              color: '#fffff',
              fontWeight: 'bold'
            }
          }}
        > 
          <Tab label="/ codecanvas"/>
          <Tab label="/ remi-hackprinceton"/>
          <Tab label="/ trueview-geminihacknight"/>
          <Tab label="/ crosssense"/>
          <Tab label="/ hack4impact-umd"/>
          <Tab label="/ garbage-collectors-rust"/>
          <Tab label="/ aestoria"/>
          <Tab label="/ time-series-forecasting"/>
          <Tab label="/ prof-rating-predictor"/>
          <Tab label="/ microcaml-compiler-eval"/>
          <Tab label="/ shell-implementation"/>
          <Tab label="/ solve-graph-maze"/>
          <Tab label="/ safesites"/>
        </Tabs>

        <TabPanel value={value} index={0}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>CodeCanvas: Visual Scratchpads for Architectural Reasoning in LLM Agents</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Fall 2025
            </Typography>

            <ul>
              <li>Developed <strong>multimodal</strong> system integrating <strong>visual codemaps, repository graphs, and cached memory</strong> to enable LLM agents' global <strong>code reasoning</strong>; <strong>reduced hallucinations by 72%</strong> and <strong>costs by 29%</strong> vs. baselines on Terminal-Bench tasks.</li>
              <li>Enhanced <strong>violation detection</strong> and <strong>cross-file dependency</strong> analysis, achieving <strong>50% fewer backtracks</strong> and <strong>33% fewer hypotheses</strong> in agent trajectories. <strong>Co-authored</strong> research paper.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python, Docker</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Remi</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              HackPrinceton Fall 2025
            </Typography>

            <ul>
              <li>Designed Remi, an <strong>intelligent meeting & voice assistant</strong> to <strong>coordinate</strong> meeting analysis, email responses, and events <strong>across Google suite</strong> to provide a <strong>personalized overview of your workday</strong>.</li>
              <li><strong>Automatically track agenda progress</strong> + <strong>generate suggestions</strong> using a <strong>knowledge graph</strong> built in <strong>Neo4j</strong>.</li>
              <li>Utilized <strong>AI-assisted</strong> rapid <strong>prototyping workflows (Copilot, Claude)</strong> to accelerate development and iteration.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Electron.js, Python, Supabase (SQL), Neo4j, Render, ElevenLabs, Gemini</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>TrueView: Bias Detection Interview Platform</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Gemini Hack Night, Nov. 2025
            </Typography>

            <ul>
              <li>Delivered a <strong>production-ready</strong> MVP with real-time transcription and <strong>performance & bias scoring</strong>, an <strong>HR analytics dashboard</strong>, and a <strong>meeting platform</strong> in <strong>&lt;8 hours</strong>.</li>
              <li>Leveraged <strong>Whisper</strong> and <strong>Gemini</strong> for <strong>multimodal analysis</strong> (video, audio, transcript).</li>
              <li>Utilized <strong>AI-assisted</strong> rapid <strong>prototyping workflows</strong> to accelerate development and iteration.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python, Next.js, Flask, Render</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Multimodal Vision Transformer for Vision, Sound & Touch</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Nov. 2025
            </Typography>

            <ul>
              <li>Designed and trained a <strong>multimodal Vision Transformer</strong> (foundation model architecture) from scratch on ObjectFolder dataset (<strong>vision + audio + tactile</strong>); <strong>optimized full AI software stack</strong> including data pre-processing/ingestion, early/late fusion compilation, and serving with <strong>83% accuracy</strong> (+18% over baselines).</li>
              <li>Implemented and benchmarked <strong>late</strong> and <strong>early fusion</strong> strategies on frozen pretrained encoders. Explored model monitoring - <strong>attention-based fusion (94%)</strong> outperformed late fusion by <strong>+12%</strong> while producing interpretable <strong>cross-modal attention maps</strong>.</li>
            </ul>
            <Typography variant='p'>Tech Stack: PyTorch, Python</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={4}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Hack4Impact-UMD: For All Ages</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Sept 2025 - Present
            </Typography>

            <ul>
              <li>An <strong>ML-driven profile-matching system</strong> connecting senior citizens with volunteers, reducing social isolation.</li>
              <li>Built the <strong>rematching pipeline</strong> by retrieving low-score pairs from <strong>Firebase</strong>, generating and upserting embeddings into <strong>Pinecone</strong>, and integrating a new <strong>Express API layer</strong> to support frontend workflows.</li>
              <li>Collaborate with <strong>cross-functional team</strong> & Microsoft mentors in an <strong>agile SDLC environment</strong>.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Firebase, Express, Node.js, React, Pinecone</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={5}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Garbage Collectors in Rust</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Fall 2024
            </Typography>

            <ul>
              <li>Implemented <strong>reference counting</strong>, <strong>mark-and-sweep</strong>, and <strong>stop-and-copy</strong> garbage collectors in <strong>safe Rust</strong>.</li>
              <li>Managed <strong>heap allocation</strong>, <strong>stack roots</strong>, <strong>pointer updating</strong>, <strong>cycles</strong>, and <strong>fragmentation</strong> using Vec-based memory simulation.</li>
              <li>Gained deep systems-level insight into <strong>memory safety</strong> and <strong>low-level debugging</strong>.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Rust, Systems Programming, Memory Management</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={6}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Aestoria: Personalized ML Image Curation Engine</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Aug. 2025 - Present
            </Typography>

            <ul>
              <li>Building CLIP-based pipeline to embed user style from Instagram and Pinterest based on vibe and quality.</li>
              <li>Implements flow-aware photo sequencing using learned aesthetic transitions and graph search.</li>
              {/* <li>Containerized backend via Docker. Basic CI/CD workflow deployed to Kubernetes test cluster.</li> */}
            </ul>
            <Typography variant='p'>Tech Stack: PyTorch, Next.js, MongoDB</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={7}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Time Series Forecasting of Class Attendance Using Weather Data</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              May 2025
            </Typography>

            <ul>
              <li>Applied <strong>ARIMA and ARIMAX time series models</strong> to evaluate correlations between weather variables and class attendance, <strong>optimizing</strong> model parameters using <strong>ACF/PACF</strong> and <strong>Dickey-Fuller stationarity tests</strong>.</li>
              <li>Conducted <strong>statistical tests (Pearson, Spearman, and t-tests)</strong> to validate research.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python</Typography>
          </Typography>
        </TabPanel>


        <TabPanel value={value} index={8}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Professor Rating Predictor</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              April 2025
            </Typography>

            <ul>
              <li>Developed <strong>Random Forest, KNN,</strong> and <strong>Ridge Regression</strong> models to predict a professor's rating on PlanetTerp (ratemyprof for UMD). Evaluated models with <strong>10-fold cross-validation</strong>, achieving up to 75.8% R² on test data.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python (Pandas, scikit-learn)</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={9}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>MicroCaml Language Development</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              2024
            </Typography>

            <ul>
              <li>Implemented custom lexer, parser, and interpreter for MicroCaml, a dynamically-typed language inspired by OCaml.</li>
              <li>Developed optimizer that simplifies ASTs created by the parser to increase runtime efficiency. </li>
              <li>Built a type checker to ensure type safety and prevent runtime errors.</li>
              <li>Added OCaml functional programming principles: lexical scoping, recursive functions, let bindings, complex control flow constructs.</li>
            </ul>
            <Typography variant='p'>Tech Stack: OCaml</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={10}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Shell Implementation</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              March 2024
            </Typography>

            <ul>
              <li>Built a Unix shell in C supporting command parsing, input/output redirection, pipes, and subshells.</li>
              <li>Used child processes. Implemented tree-based structure for pipes and subshells.</li>
            </ul>
            <Typography variant='p'>Tech Stack: C</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={11}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Finding All Possible Solutions of a Maze</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              Nov. 2023
            </Typography>

            <ul>
              <li>Represented maze as a weighted graph using ArrayLists of static inner class Vertex, adding edges only if positions weren't separated by walls; solved via BFS/DFS and implemented Dijkstra's Algorithm for the optimal path.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Java</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={12}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>SafeSites</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              2023
            </Typography>

            <ul>
              <li>Goal: To ensure users can find safe properties for their stay via AirBnB.</li>
              <li>Finds data about the crime rating of the locality a user is looking at. Uses other factors (number of children, pets, etc.) needed to find the optimal AirBnB, displays properties in order of safety rating.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python (Streamlit)</Typography>
          </Typography>
        </TabPanel>
      </Box>
    </>
  );
}  