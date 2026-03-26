import { useState } from "react";
import { predictBrakeFluid } from "../services/api";
import PredictionResult from "./PredictionResult";

export default function BrakeFluidForm({ onBack }) {
  const [dateLastBrakeFluidChange, setDateLastBrakeFluidChange] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictBrakeFluid({
        date_last_brake_fluid_change: dateLastBrakeFluidChange,
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
      <h2>Brake Fluid Prediction</h2>
      <p>Enter the date of the last brake fluid change to receive a prediction.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 500 }}>
        <label>
          Date of last brake fluid change:
          <input
            type="date"
            value={dateLastBrakeFluidChange}
            onChange={(e) => setDateLastBrakeFluidChange(e.target.value)}
            required
            style={{ width: "100%", marginTop: 6, padding: 8 }}
          />
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