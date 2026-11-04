import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { SITE_NAME, CONTACT_EMAIL } from "../config.js";

export default function Privacy() {
  const { t } = useTranslation();

  // Builds a list where each line can be translated by key
  const items = (prefix, lines) =>
    lines.map((text, i) => <li key={i}>{t(`${prefix}.${i}`, text)}</li>);

  return (
    <div className="card">
      <h1>{t("pv.title", "Privacy")}</h1>

      <h3>
        {t("pv.two.h", {
          defaultValue: "Two ways to use {{site}}",
          site: SITE_NAME,
        })}
      </h3>
      <p>
        {t("pv.two.p", {
          defaultValue:
            "You can use {{site}} as a guest, or with an account. In guest mode, your data stays on your device. With an account, your email and tracker entries are stored in our database so they sync across your devices.",
          site: SITE_NAME,
        })}
      </p>

      <h3>{t("pv.guest.h", "Guest mode")}</h3>
      <ul className="care-list">
        {items("pv.guest", [
          "No account or email is needed.",
          "Your tracker entries are stored only in this browser. We cannot see them.",
          "If you clear your browser data or switch devices, your entries are gone. Use Export on the Tracker page to keep a copy.",
        ])}
      </ul>

      <h3>{t("pv.acc.h", "Account mode: what we store")}</h3>
      <ul className="care-list">
        {items("pv.acc", [
          "Your email address and your password (stored in encrypted form).",
          "Your tracker entries: date, hair count, scalp condition, and any note you add.",
          "A record of your consent: the time you agreed, that you confirmed you are 18 or older, and the version of this page you agreed to.",
        ])}
      </ul>

      <h3>{t("pv.never.h", "What we never store")}</h3>
      <ul className="care-list">
        {items("pv.never", [
          "Your symptom checker answers, and your age group, gender, diet, place, and budget answers. They are not stored on our servers and are used only in your browser to show your results. The only exception is the optional AI explanation, described below.",
          "Your notes on the symptom checker profile screen.",
        ])}
      </ul>

      <h3>{t("pv.prov.h", "Service providers")}</h3>
      <p>
        {t(
          "pv.prov.p1",
          "We use trusted service providers to host the website, store account data securely in India, and send emails such as your confirmation email. They handle data only to provide these services for us. They may record basic technical details of a visit, such as an IP address. We do not sell your data or use it for advertising, and we do not add advertising or tracking tools of our own."
        )}
      </p>
      <p>
        {t(
          "pv.prov.p2",
          "When you log in, your browser keeps a login session in its local storage on your device."
        )}
      </p>

      <h3>{t("pv.ai.h", "Optional AI explanation")}</h3>
      <p>
        {t(
          "pv.ai.p",
          "On the results page, logged-in adults can choose a short explanation written by an AI service. It is optional, and we send anything to it only when you choose to."
        )}
      </p>
      <ul className="care-list">
        {items("pv.ai", [
          'What is sent: the names of the possible causes shown in your result (for example, "stress-related shedding") and the language you are using. Nothing else.',
          "What is not sent: your answers, your age group, gender, diet, place, or budget, your notes, your email address, or your name.",
          "The AI service is run by an outside company and processes this information outside India (in the United States). It may keep a short-term record for safety and reliability checks. We choose the provider's no-retention setting where one is offered, but we do not fully control how the provider handles data.",
          "We store a count of how many AI explanations your account has used each day, so that we can apply daily limits. This count is deleted when you delete your account.",
          "The AI writes in its own words, can make mistakes, and does not replace a doctor.",
          "This feature is not available to guests or to people under 18. You can use HairAlly fully without it.",
        ])}
      </ul>

      <h3>{t("pv.choice.h", "Your choices")}</h3>
      <ul className="care-list">
        <li>
          {t(
            "pv.choice.0",
            "You can export your tracker data at any time from the Tracker page."
          )}
        </li>
        <li>
          <Trans
            i18nKey="pv.choice.1"
            defaults="You can permanently delete your account, your email, and all your tracker entries from <account>Account settings</account>. Deletion is immediate and cannot be undone."
            components={{ account: <Link to="/account" /> }}
          />
        </li>
        <li>
          {t(
            "pv.choice.2",
            "You withdraw your consent by deleting your account. Guest mode needs no consent because nothing leaves your device."
          )}
        </li>
      </ul>

      <h3>{t("pv.age.h", "Age")}</h3>
      <p>
        {t(
          "pv.age.p",
          "Accounts are for people aged 18 or older. If you are under 18, you can still read the pages and use guest mode, but please talk to a parent or guardian and a doctor about any hair concern."
        )}
      </p>

      <h3>{t("pv.contact.h", "Contact")}</h3>
      <p>
        {t(
          "pv.contact.p",
          "Feedback, questions, requests, or complaints about your data:"
        )}{" "}
        <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>
      </p>

      <h3>{t("pv.med.h", "Not medical advice")}</h3>
      <p>
        {t("pv.med.p", {
          defaultValue:
            "{{site}} gives general educational information. It does not diagnose conditions or replace a doctor or dermatologist.",
          site: SITE_NAME,
        })}
      </p>

      <p className="progress-text">
        {t(
          "pv.foot",
          "This is a student project. Last updated November 2026. This page may change as the project grows."
        )}
      </p>
    </div>
  );
}