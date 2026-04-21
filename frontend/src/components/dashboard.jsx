// this component displays the dashboard after login
// allows the user to select which component they want to predict
export default function Dashboard({
  components,
  selectedComponent,
  setSelectedComponent,
}) {
  return (
    <div className="page-card">
      {/* -------------------- header -------------------- */}
      <div className="dashboard-header">
        <p className="eyebrow">Dashboard</p>
        <h2 className="section-title">Choose a component</h2>
        <p className="section-subtitle">
          Select a maintenance area below to begin the prediction workflow.
        </p>
      </div>


      {/* -------------------- component grid -------------------- */}
      <div className="component-grid">
        {/* loop through all components and render a button for each */}
        {components.map((component) => (
          <button
            key={component}
            // apply "selected" styling if this component is currently active
            className={`component-tile ${
              selectedComponent === component ? "selected" : ""
            }`}
            // update selected component when clicked
            onClick={() => setSelectedComponent(component)}
          >
            {/* display component name */}
            <span className="component-tile-label">{component}</span>
          </button>
        ))}
      </div>
    </div>
  );
}