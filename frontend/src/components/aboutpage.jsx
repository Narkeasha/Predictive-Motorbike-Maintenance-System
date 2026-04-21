export default function AboutPage() {
  return (
    <section className="page-card">

      {/* small label at the top */}
      <p className="eyebrow">About</p>

      {/* main heading */}
      <h2 className="section-title">About Us</h2>


      {/* short intro description */}
      <p className="section-subtitle">
        This system was developed to make maintenance easier to manage. Instead
        of using fixed intervals or requiring expensive sensors, it uses your
        riding data to estimate when key components may need attention.
      </p>

      {/* main content container */}
      <div className="content-stack">

        {/* problem + purpose */}
        <div className="about-block">
          <p>
            We aim to solve a common problem: many riders struggle to keep track
            of maintenance, which can lead to costly repairs or even safety
            risks. Our system helps you stay on top of your motorbike’s
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

          {/* list of supported components */}
          <ul className="feature-grid">
            <li>Engine Oil</li>
            <li>Tyre</li>
            <li>Brakes</li>
            <li>Chain</li>
            <li>Brake Fluid</li>
            <li>Coolant</li>
          </ul>

          {/* explains output format */}
          <p>
            The main goal of the system is to provide users with an accessible
            way to enter maintenance-related data and receive a clear result in
            the form of: <b>Safe</b>, <b>Warning</b>, or <b>Critical</b>.
          </p>
        </div>

         {/* target audience */}
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

        {/* short disclaimer */}
        <div className="about-block">
          <h3 className="section-title">Important notice</h3>
          <p>
            This system is designed to provide guidance and estimates only. It
            should not replace professional mechanical advice or regular safety
            checks.
          </p>
        </div>
      </div>
    </section>
  );
}