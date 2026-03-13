import { useState } from "react";
import { predictEngineOil } from "../services/api";

export default function EngineOilForm({ onBack }) {
  const [milesSinceOilChange, setMilesSinceOilChange] = useState("");
  const [tripType, setTripType] = useState("mixed");
  const [ridingStyle, setRidingStyle] = useState("normal");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictEngineOil({
        miles_since_oil_change: Number(milesSinceOilChange),
        trip_type: tripType,
        riding_style: ridingStyle,
      });

      setResult(response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    if (!status) return "#eee";
    const normalized = status.toLowerCase();

    if (normalized === "safe") return "#d4edda";
    if (normalized === "warning") return "#fff3cd";
    if (normalized === "critical") return "#f8d7da";

    return "#eee";
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
      <h2>Engine Oil Prediction</h2>
      <p>Enter engine oil maintenance details to receive a prediction.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 500 }}>
        <label>
          Miles since oil change:
          <input
            type="number"
            value={milesSinceOilChange}
            onChange={(e) => setMilesSinceOilChange(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
          />
        </label>

        <label>
          Trip type:
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="short">short</option>
            <option value="mixed">mixed</option>
            <option value="long">long</option>
          </select>
        </label>

        <label>
          Riding style:
          <select
            value={ridingStyle}
            onChange={(e) => setRidingStyle(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="gentle">gentle</option>
            <option value="normal">normal</option>
            <option value="aggressive">aggressive</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
          <button type="button" onClick={onBack}>
            Back
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            marginTop: 20,
            border: "1px solid #f5c2c7",
            background: "#f8d7da",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <b>Error:</b> {error}
        </div>
      )}

      {result && (
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

          <p style={{ marginTop: 8 }}>
            <b>Recommendation:</b> {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}