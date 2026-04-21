import { useState } from "react";
import { predictTyre } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";
import InfoButton from "./InfoButton";

//prediction tyre form.
export default function TyreForm({ onBack }) {

  // -------------------- input state------------.
  const [mileageSinceTyreChange, setMileageSinceTyreChange] = useState("");
  const [ridingStyle, setRidingStyle] = useState("normal");
  const [roadType, setRoadType] = useState("urban");

  //---------------ui state----------------------.
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //-------------Form submission-------------------.
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // match backend expected input format
    const formInputs = {
      mileage_since_tyre_change: Number(mileageSinceTyreChange),
      riding_style: ridingStyle,
      road_type: roadType,
    };

    try { // send request to backend API
      const response = await predictTyre(formInputs);

      setResult(response);


      // -------------------- Saving to supabase -------.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // handle potential error in getting user
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
      // handle API / request errors
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
        <h2 className="section-title">Tyre Prediction</h2>
        <p className="section-subtitle">
          Enter tyre maintenance details to receive a prediction.
        </p>
      </div>


      {/* -------------------- form -------------------- */}
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


        {/* info button */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="ridingStyle">Riding style</label>
            <InfoButton title="Riding style">
              <p><strong>Gentle</strong> – Smooth and relaxed riding. You accelerate gradually, brake gently, and take corners calmly. You’re not in a rush and focus on keeping the ride steady.</p>

              <p><strong>Normal</strong> – Your usual everyday riding. A mix of smooth cruising with occasional quicker acceleration or braking when needed. You ride with traffic and don’t push the bike too hard.</p>

              <p><strong>Aggressive</strong> – Fast and more demanding riding. You accelerate quickly, brake harder, and take corners at higher speeds. You often push the bike’s performance and ride more actively.</p>
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


        {/* info button */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="roadType">Road type</label>
            <InfoButton title="Road type">
              <p><strong>Urban</strong> – City or town roads with traffic, junctions, and frequent stopping and starting. Surfaces are generally okay but may include drains, markings, speed bumps, and small uneven areas.</p>

              <p><strong>Smooth</strong> – Well-maintained roads such as highways or motorways. The surface is consistent and even, and riding is usually steady with fewer interruptions.</p>

              <p><strong>Rough</strong> – Poor or uneven road surfaces, including potholes, bumps, loose gravel, or damaged roads. These roads feel harsher to ride on and can cause more vibration and impact.</p>
            </InfoButton>
          </div>
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