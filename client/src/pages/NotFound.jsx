import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-fg text-center px-6">
      <h1 className="text-5xl font-bold gradient-text">404</h1>
      <p className="text-muted">This page doesn't exist.</p>
      <Link to="/" className="text-brand-teal underline">
        Back home
      </Link>
    </div>
  );
}
