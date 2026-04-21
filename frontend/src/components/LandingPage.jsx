export default function LandingPage({
  components,
  onSelectComponent,
  onGetStarted,
}) {

   // landing (home) page
  return (
    <div className="landing-stack">
      {/* ----------- hero main intro---------------- */}
      <section id="home-section" className="page-card landing-card">
        <section className="hero-section">

          {/* big heading */}
          <h2 className="hero-title">
            Stay on top of your bike’s health before issues happen
          </h2>

          {/* short description */}
          <p className="hero-subtitle">
            Track your motorbike usage and receive personalised predictions for
            when key components need attention, helping you avoid breakdowns and
            stay safe.
          </p>
        </section>

        {/* -------------------- component slection -------------------- */}
        <section className="landing-section">
          <h3 className="section-title centered">
            Select a component to begin
          </h3>

          <p className="section-subtitle centered">
            Choose any component below. If you are not signed in, you will be
            taken through the login flow first.
          </p>

          {/* buttons for each component (engine oil, brakes) */}
          <div className="component-grid">
            {components.map((component) => (
              <button
                key={component}
                className="component-tile"
                onClick={() => onSelectComponent(component)} // send selected component
              >
                <span className="component-tile-label">
                  {component}
                </span>
              </button>
            ))}
          </div>
          
          {/* main CTA button */}
          <div className="hero-actions">
            <button className="primary-button" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </section>
      </section>

      {/* -----------------------------about section ----------------------------------------*/}
      <section id="about-section" className="page-card">
        <p className="eyebrow">About</p>
        <h2 className="section-title">About Us</h2>
        
        {/* explanation of system */}
        <p className="section-subtitle">
          This system was developed to make maintenance easier to manage. Instead
          of using fixed intervals or requiring expensive sensors, it uses your
          riding data to estimate when key components may need attention.
        </p>

        <div className="content-stack">

          {/* problem explanation */}
          <div className="about-block">
            <p>
              We aim to solve a common problem: many riders struggle to keep
              track of maintenance, which can lead to costly repairs or even
              safety risks. Our system helps you stay on top of your motorbike’s
              condition by providing guidance on when key components may need
              attention, helping you save money and ride more safely.
            </p>
          </div>

          {/* what the system does */}
          <div className="about-block">
            <h3 className="section-title">What we do</h3>
            <p>
              Our platform uses your riding data to estimate wear on important
              components such as:
            </p>

            {/* list of components */}
            <ul className="feature-grid">
                <li>Engine Oil</li>
                <li>Tyre</li>
                <li>Brakes</li>
                <li>Chain</li>
                <li>Brake Fluid</li>
                <li>Coolant</li>
            </ul>

            <p>
              The main goal of the system is to provide users with an accessible
              way to enter maintenance-related data and receive a clear result
              in the form of: <b>Safe</b>, <b>Warning</b>, or{" "}
              <b>Critical</b>.
            </p>
          </div>

          {/* who it's for */}
          <div className="about-block">
            <h3 className="section-title">Who it’s for</h3>

            <ul className="feature-list">
              <li>Everyday commuters who rely on their bike daily</li>
              <li>
                Motorcycle enthusiasts who want better insight into their bike’s
                condition
              </li>
            </ul>

            <p>
              Whether you ride casually or frequently, the goal is to make
              maintenance easier to understand and manage.
            </p>
          </div>

          {/* disclaimer */}
          <div className="about-block">
            <h3 className="section-title">Important notice</h3>
            <p>
              This system is designed to provide guidance and estimates only. It
              should not replace professional mechanical advice or regular
              safety checks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}