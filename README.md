<h1 align="center">
  navyakhurana.vercel.app - v1
</h1>
<!-- <p align="center"> The first iteration of  <a href="https://navyakhurana.vercel.app" target="_blank">navyakhurana.vercel.app</a>, built with Next.js & leveraging React Bits and Material UI. </p> -->
<!-- ![image](https://github.com/user-attachments/assets/77357a31-ec1a-4cc8-82ee-139d0097cbe5)  -->

<p align="center">created to showcase my work and interests, and also to explore designing an immersive tech experience and something visually distinct.</p>
<img width="1306" src="https://github.com/nkhur/personal-website/blob/main/assets/website-screenshot.png">


### tech stack:

- **Next.js**
- **Three.js** – for animated particle visualization in the background. Adapted from [this repo](https://github.com/franky-adl/waves-value-noise/tree/master).
- **Google Gemini's MediaPipe (HandLandmarker)** – for detecting hand gestures and calculating finger distance and hand orientation. These values are used to manipulate the background visualization in real-time.
- **CSS + Material UI** – for styling and layout
- **React Bits (Variable Proximity)** – creates an interactive hover effect on my name based on cursor proximity
- **Framer Motion** – handles smooth animations for gesture hint pop-ups
- **Lottie** – for high-quality, lightweight animations to visualize hand gestures


### set-up and run locally:

```bash
git clone https://github.com/navyakhurana/navya-website.git
cd navya-website

# install dependencies
npm install

# run development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
