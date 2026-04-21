import { useState } from "react";
import { predictBrakes } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";
import InfoButton from "./InfoButton";


// prediction brake form.
export default function BrakesForm({ onBack }) {
  
  // -------------------- input state------------.
  //user inputs for prediction.
  const [milesSincePadChange, setMilesSincePadChange] = useState("");
  const [ridingStyle, setRidingStyle] = useState("normal");
  const [cityRiding, setCityRiding] = useState("medium");

  //---------------ui state----------------------.
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  //-------------form submission-------------------.
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // match backend expected input format
    const formInputs = {
      miles_since_pad_change: Number(milesSincePadChange),
      riding_style: ridingStyle,
      city_riding: cityRiding,
    };

    try {
      // send request to backend API
      const response = await predictBrakes(formInputs);

      // store result for display
      setResult(response);

      //---------------saving to supabase-------------.
      // get current logged-in user.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Could not get current user:", userError.message);
      } else if (user) {
        // save prediction to history table
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
       // handle API errors
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading regardless of success/failure
    }
  }

  return (
    <div className="page-card prediction-form-card">
       {/* ---------------- header ----------------- */}
      <div className="prediction-form-header">
        <p className="eyebrow">Prediction</p>
        <h2 className="section-title">Brake System Prediction</h2>
        <p className="section-subtitle">
          Enter brake maintenance details to receive a prediction.
        </p>
      </div>

      {/* -------------------- form-------------------- */}
      <form onSubmit={handleSubmit} className="prediction-form">
         {/* mileage input */}
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

        {/* info button 1*/}
        <div className="prediction-field">
          <div className="field-label-row">
          <label htmlFor="ridingStyle">Riding style</label>
          {/* reusable info tooltip for user guidance */}
          <InfoButton title="Riding style">
            <p><strong>Gentle</strong> – Smooth riding with light and gradual braking. You slow down early and avoid sudden stops. This reduces stress on the brake pads and helps them last longer.</p>

            <p><strong>Normal</strong> – Typical everyday riding with moderate braking. You brake when needed in regular traffic conditions. This results in steady, average brake wear over time.</p>

            <p><strong>Aggressive</strong> – Frequent hard braking and quick stops, often from higher speeds. This creates more heat and friction, causing the brake pads to wear out faster.</p>
          </InfoButton>
        </div>
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

        {/* info button 2*/}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="cityRiding">City riding</label>
            <InfoButton title="City riding">
              <p><strong>Low</strong> – Mostly open roads or highways with minimal traffic and fewer stops. Braking is less frequent, so brake wear is generally lower.</p>

              <p><strong>Medium</strong> – A mix of open roads and some traffic, with occasional stopping and starting. Brake use is moderate, leading to normal wear.</p>

              <p><strong>High</strong> – Heavy traffic conditions with frequent stopping, starting, and short distances between stops. Brakes are used often, increasing friction and leading to faster wear.</p>
            </InfoButton>
          </div>
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

        {/* buttons */}
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
      {/* error display */}
      {error && (
        <div className="form-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {/* result display */}
      <PredictionResult result={result} />
    </div>
  );
}