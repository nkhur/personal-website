"use client";
import { useRef } from "react";

export default function Navbar({ refs }) {
  return (
    <nav style={{ position: "fixed", width: "100%",}}>
      <button onClick={() => refs.home.current.scrollIntoView({ behavior: "smooth" })}>Home</button>
      <button onClick={() => refs.about.current.scrollIntoView({ behavior: "smooth" })}>About</button>
      <button onClick={() => refs.projects.current.scrollIntoView({ behavior: "smooth" })}>Projects</button>
      <button onClick={() => refs.contact.current.scrollIntoView({ behavior: "smooth" })}>Contact</button>
    </nav>
  );
}
