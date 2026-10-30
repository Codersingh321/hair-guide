import { Link } from "react-router-dom";
import { SITE_NAME, CONTACT_EMAIL } from "../config.js";

export default function Privacy() {
  return (
    <div className="card">
      <h1>Privacy</h1>

      <h3>Two ways to use {SITE_NAME}</h3>
      <p>
        You can use {SITE_NAME} as a guest, or with an account. In guest mode,
        your data stays on your device. With an account, your email and tracker
        entries are stored in our database so they sync across your devices.
      </p>

      <h3>Guest mode</h3>
      <ul className="care-list">
        <li>No account or email is needed.</li>
        <li>
          Your tracker entries are stored only in this browser. We cannot see
          them.
        </li>
        <li>
          If you clear your browser data or switch devices, your entries are
          gone. Use Export on the Tracker page to keep a copy.
        </li>
      </ul>

      <h3>Account mode: what we store</h3>
      <ul className="care-list">
        <li>Your email address and your password (stored in encrypted form).</li>
        <li>
          Your tracker entries: date, hair count, scalp condition, and any note
          you add.
        </li>
        <li>
          A record of your consent: the time you agreed, that you confirmed you
          are 18 or older, and the version of this page you agreed to.
        </li>
      </ul>

      <h3>What we never store</h3>
      <ul className="care-list">
        <li>
          Your symptom checker answers, and your age group, gender, diet,
          place, and budget answers. They are used only in your browser to show
          your results, in both guest and account mode.
        </li>
        <li>Your notes on the symptom checker profile screen.</li>
      </ul>

      <h3>Service providers</h3>
      <p>
        We use trusted service providers to host the website, store account
        data securely in India, and send emails such as your confirmation
        email. They handle data only to provide these services for us. They
        may record basic technical details of a visit, such as an IP address.
        We do not sell your data or use it for advertising, and we do not add
        advertising or tracking tools of our own.
      </p>
      <p>
        When you log in, your browser keeps a login session in its local
        storage on your device.
      </p>

      <h3>Your choices</h3>
      <ul className="care-list">
        <li>
          You can export your tracker data at any time from the Tracker page.
        </li>
        <li>
          You can permanently delete your account, your email, and all your
          tracker entries from <Link to="/account">Account settings</Link>.
          Deletion is immediate and cannot be undone.
        </li>
        <li>
          You withdraw your consent by deleting your account. Guest mode needs
          no consent because nothing leaves your device.
        </li>
      </ul>

      <h3>Age</h3>
      <p>
        Accounts are for people aged 18 or older. If you are under 18, you can
        still read the pages and use guest mode, but please talk to a parent or
        guardian and a doctor about any hair concern.
      </p>

      <h3>Contact</h3>
      <p>
        Feedback, questions, requests, or complaints about your data:{" "}
        <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>
      </p>

      <h3>Not medical advice</h3>
      <p>
        {SITE_NAME} gives general educational information. It does not diagnose
        conditions or replace a doctor or dermatologist.
      </p>

      <p className="progress-text">
        This is a student project. Last updated October 2026. This page may
        change as the project grows.
      </p>
    </div>
  );
}