import { useState } from "react";
import { predictChain } from "../services/api";
import PredictionResult from "./PredictionResult";

export default function ChainForm({ onBack }) {
  const [milesSinceChainChange, setMilesSinceChainChange] = useState("");
  const [weatherExposure, setWeatherExposure] = useState("medium");
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("regular");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictChain({
        miles_since_chain_change: Number(milesSinceChainChange),
        weather_exposure: weatherExposure,
        maintenance_frequency: maintenanceFrequency,
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
      <h2>Chain Prediction</h2>
      <p>Enter chain maintenance details to receive a prediction.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 500 }}>
        <label>
          Miles since chain change:
          <input
            type="number"
            value={milesSinceChainChange}
            onChange={(e) => setMilesSinceChainChange(e.target.value)}
            required
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          />
        </label>

        <label>
          Weather exposure:
          <select
            value={weatherExposure}
            onChange={(e) => setWeatherExposure(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <label>
          Maintenance frequency:
          <select
            value={maintenanceFrequency}
            onChange={(e) => setMaintenanceFrequency(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          >
            <option value="regular">regular</option>
            <option value="occasional">occasional</option>
            <option value="rare">rare</option>
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
