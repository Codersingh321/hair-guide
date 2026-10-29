import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { SITE_NAME } from "../config.js";

export default function Account() {
  const { user, isLoading, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");

  // Send logged-out visitors to the login page
  useEffect(() => {
    if (!isLoading && !user && !deleted) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, user, deleted, navigate]);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "This permanently deletes your account, your email, and all your tracker entries. This cannot be undone. Are you sure?"
    );
    if (!confirmed) return;
    setDeleting(true);
    setDeleted(true);
    setError("");
    try {
      await deleteAccount();
    } catch (err) {
      setDeleted(false);
      setDeleting(false);
      setError(err.message || "Could not delete your account. Please try again.");
    }
  }

  if (deleted) {
    return (
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1>{deleting ? "Deleting..." : "Account deleted"}</h1>
        <p>
          Your account, email, and tracker entries have been permanently
          deleted.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>Account settings</h1>

      <div className="card">
        <h2 className="cause-title">Your account</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p className="progress-text">
          Member since {new Date(user.created_at).toLocaleDateString("en-IN")}
        </p>
        <button onClick={handleSignOut}>Log out</button>
      </div>

      <div className="card">
        <h2 className="cause-title">Your data</h2>
        <p>
          {SITE_NAME} stores your email and tracker entries. You can export
          your tracker data from the Tracker page at any time.
        </p>
        <p>
          Deleting your account permanently removes your email and all your
          tracker entries from our database. This cannot be undone.
        </p>
        {error && <p className="auth-error">{error}</p>}
        <button
          className="danger-btn"
          onClick={handleDelete}
          disabled={deleting}
          style={{ marginTop: 8 }}
        >
          Delete my account and all data
        </button>
      </div>
    </div>
  );
}