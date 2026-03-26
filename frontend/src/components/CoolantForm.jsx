import { useState } from "react";
import { predictCoolant } from "../services/api";
import PredictionResult from "./PredictionResult";

export default function CoolantForm({ onBack }) {
  const [dateLastCoolantChange, setDateLastCoolantChange] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictCoolant({
        date_last_coolant_change: dateLastCoolantChange,
      });

      setResult(response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-card prediction-form-card">
      <div className="prediction-form-header">
        <p className="eyebrow">Prediction</p>
        <h2 className="section-title">Coolant System Prediction</h2>
        <p className="section-subtitle">
          Enter the date of the last coolant replacement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="dateLastCoolantChange">
            Date of last coolant change
          </label>
          <input
            id="dateLastCoolantChange"
            className="prediction-input"
            type="date"
            value={dateLastCoolantChange}
            onChange={(e) => setDateLastCoolantChange(e.target.value)}
            required
          />
        </div>

        <div className="prediction-actions">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>

          <button
            className="secondary-action-button"
            type="button"
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </form>

      {error && (
        <div className="form-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <PredictionResult result={result} />
    </div>
  );
}