export default function AboutPage() {
  return (
    <div className="page-card">
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
          The frontend is intentionally designed around a stable response format
          so backend logic can be refined later without changing the overall user
          interface structure.
        </p>
      </div>
    </div>
  );
}