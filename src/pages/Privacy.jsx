export default function Privacy() {
  return (
    <div className="card">
      <h1>Privacy</h1>

      <h3>What stays on your device</h3>
      <p>
        Your symptom checker answers are used only to show your results and are
        not saved. Your tracker entries are stored in your own browser
        (localStorage). We do not send them to any server and we cannot see
        them.
      </p>

      <h3>What this means for you</h3>
      <ul className="care-list">
        <li>
          If you clear your browser data or switch devices, your tracker
          entries will be gone. Use the Export button on the Tracker page to
          keep a copy.
        </li>
        <li>You can delete all your tracker data at any time with Delete all.</li>
        <li>We do not ask you to create an account or give an email address.</li>
      </ul>

      <h3>Hosting</h3>
      <p>
        This website is delivered by a hosting provider, which may record
        basic technical details of each visit, such as your IP address, as most
        websites do. We do not add advertising or tracking tools of our own.
      </p>

      <h3>Not medical advice</h3>
      <p>
        HairGuide gives general educational information. It does not diagnose
        conditions or replace a doctor or dermatologist.
      </p>

      <p className="progress-text">
        This is a student project. This page may change as the project grows.
      </p>
    </div>
  );
}