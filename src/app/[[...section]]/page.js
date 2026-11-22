import Home from '../Home';

// One page, several addresses: /, /about, /experiences, /projects, /studio, /contact.
// The client scrolls to the matching section (see components/Nav.js).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ section: [] }, ...['about', 'experiences', 'projects', 'studio', 'contact'].map((s) => ({ section: [s] }))];
}

export default function Page() {
  return <Home />;
}
