export default function AboutPage() {
  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
      <h2>About Us</h2>
      <p>
        The Motorbike Predictive Maintenance System is designed to support riders
        in identifying potential maintenance issues before they become critical.
      </p>
      <p>
        The system combines machine learning models and rule-based logic to assess
        the condition of important motorbike components and return simple maintenance
        guidance through the frontend interface.
      </p>
      <p>The system supports prediction and maintenance recommendations for:</p>
      <ul>
        <li>Engine Oil</li>
        <li>Tyre</li>
        <li>Brakes</li>
        <li>Chain</li>
        <li>Brake Fluid</li>
        <li>Coolant</li>
      </ul>
      <p>
        The main goal of the system is to provide users with an accessible way to
        enter maintenance-related data and receive a clear result in the form of:
        <b> Safe</b>, <b>Warning</b>, or <b>Critical</b>.
      </p>
    </div>
  );
}