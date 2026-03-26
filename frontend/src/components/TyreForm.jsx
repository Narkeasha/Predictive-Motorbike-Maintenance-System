import { useState } from "react";
import { predictTyre } from "../services/api";
import PredictionResult from "./PredictionResult";

export default function TyreForm({ onBack }) {
  const [mileageSinceTyreChange, setMileageSinceTyreChange] = useState("");
  const [ridingStyle, setRidingStyle] = useState("normal");
  const [roadType, setRoadType] = useState("city");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictTyre({
        mileage_since_tyre_change: Number(mileageSinceTyreChange),
        riding_style: ridingStyle,
        road_type: roadType,
      });

      setResult(response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
      <h2>Tyre Prediction</h2>
      <p>Enter tyre maintenance details to receive a prediction.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 500 }}>
        <label>
          Mileage since tyre change:
          <input
            type="number"
            value={mileageSinceTyreChange}
            onChange={(e) => setMileageSinceTyreChange(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
          />
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

        <label>
          Road type:
          <select
            value={roadType}
            onChange={(e) => setRoadType(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="city">city</option>
            <option value="highway">highway</option>
            <option value="rough">rough</option>
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

      <PredictionResult result={result} />
    </div>
  );
}