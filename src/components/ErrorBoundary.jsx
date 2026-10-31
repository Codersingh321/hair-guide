import { Component } from "react";

// Shows a message instead of a blank page if something crashes.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            maxWidth: 560,
            margin: "60px auto",
            padding: 20,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Something went wrong</h1>
          <p>Please reload the page.</p>
          {import.meta.env.DEV && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#fdf0f0",
                padding: 12,
                borderRadius: 8,
              }}
            >
              {String(this.state.error && this.state.error.message)}
            </pre>
          )}
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}