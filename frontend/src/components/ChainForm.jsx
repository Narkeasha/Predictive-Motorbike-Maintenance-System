import { useState } from "react";
import { predictChain } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";
import InfoButton from "./InfoButton";


//prediction chain form.
export default function ChainForm({ onBack }) {

  // -------------------- input state------------.
  //user inputs for prediction.
  const [milesSinceChainChange, setMilesSinceChainChange] = useState("");
  const [weatherExposure, setWeatherExposure] = useState("medium");
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("regular");


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
      miles_since_chain_change: Number(milesSinceChainChange),
      weather_exposure: weatherExposure,
      maintenance_frequency: maintenanceFrequency,
    };

    try {
      // send request to backend API
      const response = await predictChain(formInputs);

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
      // handle API errors
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading regardless of success/failure
    }
  }

  return (
    <div className="page-card prediction-form-card">
         {/* -------------------- header -------------------- */}
      <div className="prediction-form-header">
        <p className="eyebrow">Prediction</p>
        <h2 className="section-title">Chain Prediction</h2>
        <p className="section-subtitle">
          Enter chain maintenance details to receive a prediction.
        </p>
      </div>


      {/* -------------------- form -------------------- */}
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

        {/* info button 1 */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="weatherExposure">Weather exposure</label>
            {/*info button */}
            <InfoButton title="Weather exposure">
              <p><strong>Low</strong> – Mostly dry riding conditions with little exposure to rain, mud, or dirt. The chain stays cleaner and experiences less corrosion and wear.</p>

              <p><strong>Medium</strong> – Occasional riding in wet or dirty conditions, such as light rain or damp roads. Some exposure to moisture and debris, leading to moderate wear.</p>

              <p><strong>High</strong> – Frequent riding in rain, mud, or harsh conditions. Moisture and dirt can increase rust, contamination, and faster chain wear.</p>
            </InfoButton>
          </div>
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

        {/* info button 2 */}
        <div className="prediction-field">
          <div className="field-label-row">
            <label htmlFor="maintenanceFrequency">Maintenance frequency</label>
            {/*info button */}
            <InfoButton title="Maintenance frequency">
              <p><strong>Often</strong> – You regularly clean and lubricate the chain, keeping it in good condition. This reduces friction and helps extend chain life.</p>

              <p><strong>Sometimes</strong> – You maintain the chain occasionally, but not on a consistent schedule. Wear is moderate due to inconsistent lubrication and cleaning.</p>

              <p><strong>Rarely</strong> – The chain is not cleaned or lubricated often. Increased friction and dirt buildup can lead to faster wear and damage.</p>
            </InfoButton>
          </div>
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