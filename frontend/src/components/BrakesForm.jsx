import { useState } from "react";
import { predictBrakes } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";

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

    const formInputs = {
      miles_since_pad_change: Number(milesSincePadChange),
      riding_style: ridingStyle,
      city_riding: cityRiding,
    };

    try {
      const response = await predictBrakes(formInputs);

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
              component: "Brakes",
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
        <h2 className="section-title">Brake System Prediction</h2>
        <p className="section-subtitle">
          Enter brake maintenance details to receive a prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="milesSincePadChange">Miles since pad change</label>
          <input
            id="milesSincePadChange"
            className="prediction-input"
            type="number"
            value={milesSincePadChange}
            onChange={(e) => setMilesSincePadChange(e.target.value)}
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
          <label htmlFor="cityRiding">City riding</label>
          <select
            id="cityRiding"
            className="prediction-select"
            value={cityRiding}
            onChange={(e) => setCityRiding(e.target.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
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