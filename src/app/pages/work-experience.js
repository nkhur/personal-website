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

export default function WorkExperiencePage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <div>
      <h2>\ work-experience</h2>
    </div>
    <div style={{height:"100%", width:"100%"}}>
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
            // width: '240px',
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
          <Tab label="/ digital-engagement-lab"/>
          <Tab label="/ passionfruit"/>
          <Tab label="/ shah-lab"/>
        </Tabs>
        <TabPanel value={value} index={0}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Research Assistant @ Digital Engagement Lab, UMD</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              March 2025 – Present 
            </Typography>
            <Typography variant='p'>Working towards the lab’s mission to reimagine how young audiences engage with political and news content through data, AI, and interaction design.</Typography>
            <ul>
              <li>Audience Sentiment Analysis: Leveraged the YouTube Data API to extract structured metadata and all user comments across political content. Applied HuggingFace models for emotion and semantic classification on individual comments, titles, and transcripts — aggregating results to evaluate viewer sentiment and alignment with video intent.</li>
              <li><a href="https://smart-story-agent.vercel.app/">New View News</a>: The lab's AI-enhanced news reading platform. Integrated PostHog to record user behavior (cursor heatmaps, click frequency, session replays, etc.), thus enabling future UX research via event-level analytics and SQL-style querying. Currently integrating the open-source news-story-viz tool into our platform to generate narrative-driven visual summaries of news articles.Implementing tools to observe user interaction with the  - under development as a more interactive and engaging news format.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python (Pandas, PyTorch, HuggingFace), TypeScript</Typography>
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Software Engineer Intern @ Passionfruit, NYC</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              July 2024 – September 2024 
            </Typography>

            <Typography variant='p'>Startup backed by Stanford, StartX, CMU. Developed multiple machine learning and backend features used by the marketing teams to generate, evaluate, and optimize SEO content at scale. Projects:</Typography>
            <ul>
              <li>SEO Content Ideas Generator: Built a tool that scraped Google's “People Also Ask” questions and top-ranking blog structures (e.g., word count, hyperlink density, image usage) to auto-generate LLM prompts for content ideation tailored to Google’s ranking preferences. </li>
              <li>Topical Authority Scorer: Designed a scoring system that evaluated how well a blog post aligned with a given topic. Used YAKE and BERT for keyword extraction, and semantic similarity via text embeddings + cosine similarity to assess relevance. </li>
              <li>Performance Analytics Chatbot: Created a chatbot that suggested actionable SEO improvements for individual clients by analyzing historical website metrics. Implemented linear regression to detect significant changes tied to specific SEO tasks over custom time windows.</li>
              <li>Content Editor Tool: Engineered a real-time content editing experience with live keyword scoring, autosave, and GPT-based rewrite suggestions to improve on-page SEO.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Node.js, Next.js, Python, OpenAI, MongoDB</Typography>
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Research Assistant @ Shah Lab, UMD</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              February 2024 – September 2024 
            </Typography>

            <Typography variant='p'>Worked on developing a neural interface for restoring motor control in Parkinson’s patients using closed-loop brain stimulation, with Professor Sahil Shah (ECE) @ UMD. Delivered an end-to-end system for real-time stimulation, recording, and visualization of neural activity, enabling future clinical experimentation for the lab.</Typography>
            <ul>
              <li>GUI Development: Built a custom Python-based GUI to decode and display neural signals sent to and from the Intan RHS 2000 board. Data was streamed as binary and decoded+formatted for real-time visualization in OpenEphys (C++-based electrophysiology GUI). Added user-defined alert functionality to flag incoming neural signals that matched specified patterns, assisting researchers in tracking critical neural events during trials. </li>
              <li>Real-Time Signal Stimulation: Engineered a live stimulation feature that triggered specific outputs based on received signal characteristics — enabling immediate response in closed-loop experiments.</li>
              <li>Hardware-Specific Codegen: Created SPI command interpreters to generate .coe files for loading experimental stimulation patterns onto the board. </li>
              <li>Supported researchers with custom firmware patches and documentation to ensure smooth lab adoption.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python</Typography>
          </Typography>
        </TabPanel>
      </Box>
    </div>
    </>
  );
}  