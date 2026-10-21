import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}