import { useState } from "react";
import { predictEngineOil } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";

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

    const formInputs = {
      miles_since_oil_change: Number(milesSinceOilChange),
      trip_type: tripType,
      riding_style: ridingStyle,
    };

    try {
      const response = await predictEngineOil(formInputs);

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
              component: "Engine Oil",
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
        <h2 className="section-title">Engine Oil Prediction</h2>
        <p className="section-subtitle">
          Enter engine oil maintenance details to receive a prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="milesSinceOilChange">Miles since oil change</label>
          <input
            id="milesSinceOilChange"
            className="prediction-input"
            type="number"
            value={milesSinceOilChange}
            onChange={(e) => setMilesSinceOilChange(e.target.value)}
            required
          />
        </div>

        <div className="prediction-field">
          <label htmlFor="tripType">Trip type</label>
          <select
            id="tripType"
            className="prediction-select"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="short">short</option>
            <option value="mixed">mixed</option>
            <option value="long">long</option>
          </select>
        </div>

        <div className="prediction-field">
          <label htmlFor="ridingStyle">Riding style</label>
          <select
            id="ridingStyle"
            className="prediction-select"
            value={ridingStyle}
            onChange={(e) => setRidingStyle(e.target.value)}
          >
            <option value="gentle">gentle</option>
            <option value="normal">normal</option>
            <option value="aggressive">aggressive</option>
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