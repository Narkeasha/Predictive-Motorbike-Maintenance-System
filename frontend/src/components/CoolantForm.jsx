import { useState } from "react";
import { predictCoolant } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";

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

    const formInputs = {
      date_last_coolant_change: dateLastCoolantChange,
    };

    try {
      const response = await predictCoolant(formInputs);

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
              component: "Coolant",
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