import { useState } from "react";
import { predictEngineOil } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";
import InfoButton from "./InfoButton";

// prediction engine oil form.
export default function EngineOilForm({ onBack }) {

  // -------------------- input state------------.
  const [milesSinceOilChange, setMilesSinceOilChange] = useState("");
  const [tripType, setTripType] = useState("mixed");
  const [ridingStyle, setRidingStyle] = useState("normal");

  //-------------------- UI STATE --------------------
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
      miles_since_oil_change: Number(milesSinceOilChange),
      trip_type: tripType,
      riding_style: ridingStyle,
    };

    
    try {
      // send request to backend API
      const response = await predictEngineOil(formInputs);

      setResult(response);

      // -------------------- saving to supabase -------.
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
      {/* -------------------- header -------------------- */}
      <div className="prediction-form-header">
        <p className="eyebrow">Prediction</p>
        <h2 className="section-title">Engine Oil Prediction</h2>
        <p className="section-subtitle">
          Enter engine oil maintenance details to receive a prediction.
        </p>
      </div>


      {/* -------------------- form -------------------- */}
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


        {/* info button 1 */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="tripType">Trip type</label>
            <InfoButton title="Trip type">
              <p><strong>Short</strong> – Frequent short journeys (e.g. under 10–15 minutes), such as commuting or quick trips. The engine often doesn’t fully warm up before the ride ends.</p>
              <p><strong>Mixed</strong> – A combination of short trips and longer rides. The engine sometimes reaches full operating temperature but not always.</p>
              <p><strong>Long</strong> – Mostly longer rides (e.g. over 20–30 minutes) where the engine stays at a steady operating temperature for extended periods.</p>
            </InfoButton>
          </div>

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

        {/* info button 2 */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="ridingStyle">Riding style</label>
            <InfoButton title="Riding style">
              <p><strong>Gentle</strong> – Smooth and relaxed riding. You accelerate gradually, brake gently, and keep speeds lower. You focus on maintaining control and a steady ride rather than speed.</p>
              <p><strong>Normal</strong> – Your usual everyday riding. A mix of smooth cruising with occasional quicker acceleration or braking when needed. You ride with traffic and don’t push the bike too hard.</p>
              <p><strong>Aggressive</strong> – Fast and more demanding riding. You accelerate quickly, brake harder, and change speeds more often. You often push the bike’s performance, which puts more strain on the engine and wears the oil out faster.</p>
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

        {/* action buttons */}
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