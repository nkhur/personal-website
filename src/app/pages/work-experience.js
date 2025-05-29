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

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '1rem',
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

            <ul>
              <li>Finding data using YouTube API for audience engagement with news channels + using NLP to drive insights (eg. averaging the sentiment analysis on comments, detecting curiosity-creating keywords in the title)</li>
              <li>Implementing tools to observe user interaction with the <a href="https://smart-story-agent.vercel.app/">“New View News” site</a> - under development as a more interactive and engaging news format.</li>
            </ul>
            <p>Tech Stack: Python (Pandas, PyTorch, HuggingFace), TypeScript</p>
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

            <Typography variant='p'>Startup backed by Stanford, StartX, CMU. Created AI-driven and LLM-powered tools and solutions, to help create optimized SEO strategies and content generation for various clients. Projects:</Typography>
            <ul>
              <li>SEO Content Ideas Generator: Data from Google's popular questions + top blogs structure (word limit, # of links, # of images, etc.) used in LLM prompt. Scraping using puppeteer, playwright, and axios+cheerio.</li>
              <li>Topical Authority Scorer: Assessing SEO relevance for inputted content and a chosen topic. Extracted keywords from content text using YAKE and BERT. Scoring keywords, headings, metatags, & url via text-embeddings + cosine-similiarity and LLM APIs.</li>
              <li>Chatbot for Suggested Actions: Based on performance data of websites (fetching from mongoDB). Used linear regression to analyze metric changes over specified duration for each specific SEO task.</li>
              <li>Content Editor: With real-time keyword analysis⁠​ + autosave, rewrite, and download functionality.</li>
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

            <Typography variant='p'>Project: Creating a neural system that sends & records neural signals sent to brain.</Typography>
            <ul>
              <li>Designed + developed GUI (Module: PyQt6) used to send, clean, and record neural data using bit manipulation; neural interface connected via RESTful API (Module: Flask). </li>
              <li>Analyzed C++ OpenEphys repositories to integrate functions for specific board requirements + select plugins to connect my GUI with OpenEphys</li>
              <li>Generating .coe files from inputted SPI Commands, as per Intan RHS 2000 Board requirements. </li>
              <li>Handled any firmware requirements as needed. </li>
            </ul>
            <Typography variant='p'>Tech Stack: Python</Typography>
          </Typography>
        </TabPanel>
      </Box>
    </div>
    </>
  );
}  