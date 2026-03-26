export default function PredictionResult({ result }) {
  if (!result) return null;

  function getStatusColor(status) {
    if (!status) return "#eee";

    const normalized = status.toLowerCase();

    if (normalized === "safe") return "#d4edda";
    if (normalized === "warning") return "#fff3cd";
    if (normalized === "critical") return "#f8d7da";

    return "#eee";
  }

  return (
    <div
      style={{
        marginTop: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Prediction Result</h3>

      <div
        style={{
          display: "inline-block",
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: "bold",
          background: getStatusColor(result.status),
          marginBottom: 12,
        }}
      >
        {result.status}
      </div>

      <p>
        <b>Recommendation:</b> {result.recommendation}
      </p>
    </div>
  );
}