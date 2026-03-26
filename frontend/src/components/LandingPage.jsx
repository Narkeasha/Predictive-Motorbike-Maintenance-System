export default function LandingPage({
  components,
  onSelectComponent,
  onGetStarted,
}) {
  return (
    <div className="page-card landing-card">
      <section className="hero-section">
        <h2 className="hero-title">
          Smarter motorbike maintenance, made simple.
        </h2>

        <p className="hero-subtitle">
          Monitor key bike components, submit maintenance-related inputs, and
          receive clear condition predictions with practical recommendations.
        </p>
      </section>

      <section className="landing-section">
        <h3 className="section-title centered">Select a component to begin</h3>
        <p className="section-subtitle centered">
          Choose any component below. If you are not signed in, you will be taken
          to the login flow first.
        </p>

        <div className="component-grid">
          {components.map((component) => (
            <button
              key={component}
              className="component-tile"
              onClick={() => onSelectComponent(component)}
            >
              <span className="component-tile-label">{component}</span>
            </button>
          ))}
        </div>

        <div className="hero-actions">
          <button className="primary-button" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}