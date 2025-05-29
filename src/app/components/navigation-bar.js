"use client";

export default function Navbar({ refs }) {
  return (
    <nav style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1rem",
      paddingTop: "9%",
      // paddingBottom:"5%"
    }}>
      <button onClick={() => refs.about.current.scrollIntoView({ behavior: "smooth" })}>\ about</button>
      <button onClick={() => refs.work_experience.current.scrollIntoView({ behavior: "smooth" })}>\ work-experience</button>
      <button onClick={() => refs.projects.current.scrollIntoView({ behavior: "smooth" })}>\ projects</button>
    </nav>
  );
}
