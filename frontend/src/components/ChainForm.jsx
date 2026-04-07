import { useState } from "react";
import { predictChain } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";

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

    const formInputs = {
      miles_since_chain_change: Number(milesSinceChainChange),
      weather_exposure: weatherExposure,
      maintenance_frequency: maintenanceFrequency,
    };

    try {
      const response = await predictChain(formInputs);

      setResult(response);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Could not get current user:", userError.message);
      } else if (user) {
        const { error: insertError } = await supabase
          .from("maintenance_records")
          .insert([
            {
              user_id: user.id,
              component: "Chain",
              inputs: formInputs,
              outputs: response,
            },
          ]);

        if (insertError) {
          console.error("Failed to save prediction history:", insertError.message);
        }
      }
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
        <h2 className="section-title">Chain Prediction</h2>
        <p className="section-subtitle">
          Enter chain maintenance details to receive a prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="milesSinceChainChange">Miles since chain change</label>
          <input
            id="milesSinceChainChange"
            className="prediction-input"
            type="number"
            value={milesSinceChainChange}
            onChange={(e) => setMilesSinceChainChange(e.target.value)}
            required
          />
        </div>

        <div className="prediction-field">
          <label htmlFor="weatherExposure">Weather exposure</label>
          <select
            id="weatherExposure"
            className="prediction-select"
            value={weatherExposure}
            onChange={(e) => setWeatherExposure(e.target.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>

        <div className="prediction-field">
          <label htmlFor="maintenanceFrequency">Maintenance frequency</label>
          <select
            id="maintenanceFrequency"
            className="prediction-select"
            value={maintenanceFrequency}
            onChange={(e) => setMaintenanceFrequency(e.target.value)}
          >
            <option value="regular">often</option>
            <option value="occasional">sometimes</option>
            <option value="rare">rarely</option>
          </select>
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