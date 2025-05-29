"use client";

export default function Navbar({ refs }) {
  return (
    <nav style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1rem",
      paddingTop: "9%",
    }}>
      <button onClick={() => refs.about.current.scrollIntoView({ behavior: "smooth" })}>\ about</button>
      <button onClick={() => refs.workExperience.current.scrollIntoView({ behavior: "smooth" })}>\ work-experience</button>
      <button onClick={() => refs.projects.current.scrollIntoView({ behavior: "smooth" })}>\ projects</button>
    </nav>
  );
}
