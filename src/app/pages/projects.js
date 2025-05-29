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
          <Tab label="/ prof-rating-predictor"/>
          <Tab label="/ microcaml-compiler-eval"/>
          <Tab label="/ shell-implementation"/>
          <Tab label="/ solve-graph-maze"/>
          <Tab label="/ safesites"/>
        </Tabs>
        <TabPanel value={value} index={0}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Professor Rating Predictor</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              2025
            </Typography>

            <ul>
              <li>Built 3 ML models to predict a professor’s rating using the PlanetTerp API (similar to ratemyprofessor for UMD students) without using the actual rating as the feature. Tested to determine the best model, presented in a slide deck.</li>
            </ul>
            <Typography variant='p'>Tech Stack: Python (Pandas, scikit-learn) </Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={1}>
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

        <TabPanel value={value} index={2}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Shell Implementation</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              2024
            </Typography>

            <ul>
              <li>Supports certain commands: &&, pipes, input output redirection, and subshell.</li>
              <li>Pipes and subshells handled using a tree structure (code making the tree from input given).</li>
              <li>Use of child processes to handle specific commands</li>
            </ul>
            <Typography variant='p'>Tech Stack: C</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Typography sx={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Josefin Sans, sans-serif' }}>

            <Typography variant='h5' sx={{fontFamily: 'Josefin Sans, sans-serif'}}>Finding All Possible Solutions of a Maze</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#bbbbbb', fontFamily: 'Josefin Sans, sans-serif', marginBottom: '1rem' }}> 
              2023
            </Typography>

            <ul>
              <li>Each (x,y) in the maze, represented as an instance of class Juncture, is a vertex of the graph.</li>
              <li>Represented a maze as a weighted graph using ArrayLists, storing instances of static inner class Vertex. Ensuring edges only added if maze positions not separated by walls. </li>
              <li>Finding the solution(s) to the maze via Breath-First and Depth-First Search. Implemented Djikstra’s Algorithm to find the most optimal solution. (GUI Provided)</li>
            </ul>
            <Typography variant='p'>Tech Stack: Java</Typography>
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={4}>
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