import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="card">
      <h1>{t("nf.title", "Page not found")}</h1>
      <p>
        <Link to="/">{t("nf.home", "Go back home")}</Link>
      </p>
    </div>
  );
}