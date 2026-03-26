import AuthForm from "./authform";

export default function LandingPage({
  components,
  onSelectComponent,
  onGetStarted,
  showAuth,
  email,
  password,
  setEmail,
  setPassword,
  signIn,
  signUp,
  pendingComponent,
  onBackFromAuth,
}) {
  return (
    <div className="landing-stack">
      <section id="home-section" className="page-card landing-card">
        <section className="hero-section">
          <h2 className="hero-title">
            Smarter motorbike maintenance, made simple.
          </h2>

          <p className="hero-subtitle">
            Monitor key bike components, submit maintenance-related inputs, and
            receive clear condition predictions with practical maintenance
            recommendations.
          </p>
        </section>

        <section className="landing-section">
          <h3 className="section-title centered">Select a component to begin</h3>
          <p className="section-subtitle centered">
            Choose any component below. If you are not signed in, you will be
            taken through the login flow first.
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
      </section>

      {showAuth && (
        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          signIn={signIn}
          signUp={signUp}
          onBack={onBackFromAuth}
          pendingComponent={pendingComponent}
        />
      )}

      <section id="about-section" className="page-card">
        <p className="eyebrow">About</p>
        <h2 className="section-title">About the system</h2>

        <p className="section-subtitle">
          The Motorbike Predictive Maintenance System is designed to help riders
          assess the condition of major motorbike components before faults become
          severe.
        </p>

        <div className="content-stack">
          <p>
            The system combines machine learning models and rule-based logic to
            evaluate maintenance-related input data and return a standardised
            result in the form of a maintenance status and recommendation.
          </p>

          <p>The platform currently supports predictions for:</p>

          <ul className="feature-list">
            <li>Engine Oil</li>
            <li>Tyre</li>
            <li>Brakes</li>
            <li>Chain</li>
            <li>Brake Fluid</li>
            <li>Coolant</li>
          </ul>

          <p>
            The frontend is intentionally designed around a stable response
            format so backend logic can be refined later without changing the
            overall user interface structure.
          </p>
        </div>
      </section>
    </div>
  );
}