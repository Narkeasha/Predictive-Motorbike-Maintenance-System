export default function Dashboard({
  components,
  selectedComponent,
  setSelectedComponent,
}) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
      <h2>Dashboard</h2>
      <p>Select a component to begin the prediction workflow.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 20,
        }}
      >
        {components.map((component) => (
          <button
            key={component}
            onClick={() => setSelectedComponent(component)}
            style={{
              padding: "16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: selectedComponent === component ? "#e8f0fe" : "#fff",
              cursor: "pointer",
              fontWeight: selectedComponent === component ? "bold" : "normal",
            }}
          >
            {component}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {!selectedComponent ? (
          <p>No component selected yet.</p>
        ) : (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              background: "#fafafa",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{selectedComponent}</h3>
            <p>This component has been selected successfully.</p>
            <p>
              Click the selected component again from the dashboard flow to open
              or continue building its prediction form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}