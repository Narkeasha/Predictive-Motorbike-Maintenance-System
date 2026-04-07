import { useState } from "react";
import { predictTyre } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";

export default function TyreForm({ onBack }) {
  const [mileageSinceTyreChange, setMileageSinceTyreChange] = useState("");
  const [ridingStyle, setRidingStyle] = useState("normal");
  const [roadType, setRoadType] = useState("urban");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const formInputs = {
      mileage_since_tyre_change: Number(mileageSinceTyreChange),
      riding_style: ridingStyle,
      road_type: roadType,
    };

    try {
      const response = await predictTyre(formInputs);

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
              component: "Tyre",
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
        <h2 className="section-title">Tyre Prediction</h2>
        <p className="section-subtitle">
          Enter tyre maintenance details to receive a prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="mileageSinceTyreChange">
            Mileage since tyre change
          </label>
          <input
            id="mileageSinceTyreChange"
            className="prediction-input"
            type="number"
            value={mileageSinceTyreChange}
            onChange={(e) => setMileageSinceTyreChange(e.target.value)}
            required
          />
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

        <div className="prediction-field">
          <label htmlFor="roadType">Road type</label>
          <select
            id="roadType"
            className="prediction-select"
            value={roadType}
            onChange={(e) => setRoadType(e.target.value)}
          >
            <option value="urban">urban</option>
            <option value="smooth">smooth</option>
            <option value="rough">rough</option>
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