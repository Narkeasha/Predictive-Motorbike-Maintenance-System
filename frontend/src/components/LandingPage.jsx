export default function LandingPage({
  components,
  onSelectComponent,
  onGetStarted,
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
      
      <section id="about-section" className="page-card">
        <p className="eyebrow">About</p>
        <h2 className="section-title">About Us</h2>

        <p className="section-subtitle">
            The Predictive Motorbike Maintenance System is designed to make motorcycle
            maintenance simpler, smarter, and more accessible for everyday riders.
        </p>

        <div className="content-stack">
            <p>
            We aim to solve a common problem: many riders struggle to keep track of
            maintenance, which can lead to costly repairs or even safety risks. Our
            system helps you stay on top of your motorbike’s condition by providing
            guidance on when key components may need attention — helping you save money
            and ride more safely.
            </p>

            <h3 className="section-title">What We Do</h3>
            <p>
            Our platform uses your riding data to estimate wear on important components
            such as:
            </p>
            <ul className="feature-list">
            <li>Engine oil</li>
            <li>Tyres</li>
            <li>Chain and sprockets</li>
            </ul>
            <p>
            Instead of relying on fixed schedules or expensive sensors, we provide
            simple, data-driven insights that adapt to how you actually use your bike.
            </p>

            <h3 className="section-title">Who It’s For</h3>
            <ul className="feature-list">
            <li>Everyday commuters who rely on their bike daily</li>
            <li>Motorcycle enthusiasts who want better insight into their bike’s condition</li>
            </ul>
            <p>
            Whether you ride casually or frequently, the goal is to make maintenance
            easier to understand and manage.
            </p>

            <h3 className="section-title">Important Notice</h3>
            <p>
            This system is designed to provide guidance and estimates only. It should
            not replace professional mechanical advice or regular safety checks.
            </p>

            <h3 className="section-title">About the Project</h3>
            <p>
            This system was developed as part of a final-year project, combining
            concepts from data science, machine learning, and web development to
            explore practical solutions for real-world motorcycle maintenance
            challenges.
            </p>
        </div>
        </section>
    </div>
  );
}