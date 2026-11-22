import Home from '../Home';

// One page, several addresses: /, /about, /skills, /experiences, /projects, /in-progress.
// The client scrolls to the matching section (see components/Nav.js).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ section: [] }, ...['about', 'skills', 'experiences', 'projects', 'in-progress'].map((s) => ({ section: [s] }))];
}

export default function Page() {
  return <Home />;
}
