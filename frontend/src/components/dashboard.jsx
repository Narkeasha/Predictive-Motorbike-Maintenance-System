export default function Dashboard({
  components,
  selectedComponent,
  setSelectedComponent,
}) {
  return (
    <div className="page-card">
      <div className="dashboard-header">
        <p className="eyebrow">Dashboard</p>
        <h2 className="section-title">Choose a component</h2>
        <p className="section-subtitle">
          Select a maintenance area below to begin the prediction workflow.
        </p>
      </div>

      <div className="component-grid">
        {components.map((component) => (
          <button
            key={component}
            className={`component-tile ${
              selectedComponent === component ? "selected" : ""
            }`}
            onClick={() => setSelectedComponent(component)}
          >
            <span className="component-tile-label">{component}</span>
          </button>
        ))}
      </div>
    </div>
  );
}