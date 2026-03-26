import { useState } from "react";
import { predictBrakes } from "../services/api";
import PredictionResult from "./PredictionResult";

export default function BrakesForm({ onBack }) {
  const [milesSincePadChange, setMilesSincePadChange] = useState("");
  const [ridingStyle, setRidingStyle] = useState("normal");
  const [cityRiding, setCityRiding] = useState("medium");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictBrakes({
        miles_since_pad_change: Number(milesSincePadChange),
        riding_style: ridingStyle,
        city_riding: cityRiding,
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
      <h2>Brake System Prediction</h2>
      <p>Enter brake maintenance details to receive a prediction.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 500 }}>
        <label>
          Miles since pad change:
          <input
            type="number"
            value={milesSincePadChange}
            onChange={(e) => setMilesSincePadChange(e.target.value)}
            required
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          />
        </label>

        <label>
          Riding style:
          <select
            value={ridingStyle}
            onChange={(e) => setRidingStyle(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="gentle">gentle</option>
            <option value="normal">normal</option>
            <option value="aggressive">aggressive</option>
          </select>
        </label>

        <label>
          City riding:
          <select
            value={cityRiding}
            onChange={(e) => setCityRiding(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 10 }}>
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
