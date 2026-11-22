import Home from '../Home';

// One page, several addresses: /, /about, /skills, /experiences, /projects, /studio.
// The client scrolls to the matching section (see components/Nav.js).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ section: [] }, ...['about', 'skills', 'experiences', 'projects', 'studio'].map((s) => ({ section: [s] }))];
}

export default function Page() {
  return <Home />;
}
