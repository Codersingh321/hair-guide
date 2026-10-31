import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { SITE_NAME } from "../config.js";

export default function Account() {
  const { t, i18n } = useTranslation();
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
      t(
        "acc.confirm",
        "This permanently deletes your account, your email, and all your tracker entries. This cannot be undone. Are you sure?"
      )
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
      setError(err.message || "");
    }
  }

  if (deleted) {
    return (
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1>
          {deleting
            ? t("acc.deleting", "Deleting...")
            : t("acc.deleted.title", "Account deleted")}
        </h1>
        <p>
          {t(
            "acc.deleted.text",
            "Your account, email, and tracker entries have been permanently deleted."
          )}
        </p>
        <Link to="/" className="btn btn-primary">
          {t("acc.home", "Back to home")}
        </Link>
      </div>
    );
  }

  if (!user) return null;

  const locale = i18n.language === "hi" ? "hi-IN" : "en-IN";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>{t("acc.title", "Account settings")}</h1>

      <div className="card">
        <h2 className="cause-title">
          {t("acc.yourAccount", "Your account")}
        </h2>
        <p>
          <strong>{t("acc.email", "Email:")}</strong> {user.email}
        </p>
        <p className="progress-text">
          {t("acc.since", {
            defaultValue: "Member since {{date}}",
            date: new Date(user.created_at).toLocaleDateString(locale),
          })}
        </p>
        <button onClick={handleSignOut}>{t("acc.logout", "Log out")}</button>
      </div>

      <div className="card">
        <h2 className="cause-title">{t("acc.data.title", "Your data")}</h2>
        <p>
          {t("acc.data.p1", {
            defaultValue:
              "{{site}} stores your email and tracker entries. You can export your tracker data from the Tracker page at any time.",
            site: SITE_NAME,
          })}
        </p>
        <p>
          {t(
            "acc.data.p2",
            "Deleting your account permanently removes your email and all your tracker entries from our database. This cannot be undone."
          )}
        </p>
        {error !== "" && (
          <p className="auth-error">
            {t(
              "acc.err",
              error || "Could not delete your account. Please try again."
            )}
          </p>
        )}
        <button
          className="danger-btn"
          onClick={handleDelete}
          disabled={deleting}
          style={{ marginTop: 8 }}
        >
          {t("acc.delete", "Delete my account and all data")}
        </button>
      </div>
    </div>
  );
}