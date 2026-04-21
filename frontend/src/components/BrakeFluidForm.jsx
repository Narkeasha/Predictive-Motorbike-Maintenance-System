import { useState } from "react";
import { predictBrakeFluid } from "../services/api";
import PredictionResult from "./PredictionResult";
import { supabase } from "../supabaseClient";


//-------------------------brake fluid prediction form.------------------------.
export default function BrakeFluidForm({ onBack }) {
  // local state for user input.
  const [dateLastBrakeFluidChange, setDateLastBrakeFluidChange] = useState("");

  //store prediction returned from baceknd.
  const [result, setResult] = useState(null);

  //loading state for submit button.
  const [loading, setLoading] = useState(false);

  //error state to displays issues durint prediction processs.
  const [error, setError] = useState("");

  //runs when form a form is submitted.
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    //shapes input exactrly how the backend expect it.
    const formInputs = {
      date_last_brake_fluid_change: dateLastBrakeFluidChange,
    };

    try {
      //send request to the baclend api.
      const response = await predictBrakeFluid(formInputs);

      //stores returned predictions hisotry to supabase databse.
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
              component: "Brake Fluid",
              inputs: formInputs,
              outputs: response,
            },
          ]);

        if (insertError) {
          console.error("Failed to save prediction history:", insertError.message);
        }
      }
    } catch (err) {
      //shows any api/request errors in the ui.
      setError(err.message || "Something went wrong");
    } finally {
      //always stop loading state when request finished.
      setLoading(false);
    }
  }

  return (
    <div className="page-card prediction-form-card">
       {/* page heading / intro */}
      <div className="prediction-form-header">
        <p className="eyebrow">Prediction</p>
        <h2 className="section-title">Brake Fluid Prediction</h2>
        <p className="section-subtitle">
          Enter the date of the last brake fluid change to receive a prediction.
        </p>
      </div>

      {/* main prediction form */}
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="prediction-field">
          <label htmlFor="dateLastBrakeFluidChange">
            Date of last brake fluid change
          </label>
          <input
            id="dateLastBrakeFluidChange"
            className="prediction-input"
            type="date"
            value={dateLastBrakeFluidChange}
            onChange={(e) => setDateLastBrakeFluidChange(e.target.value)}
            required
          />
        </div>

        {/* form action buttons */}
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

      {/* show error if request fails */}
      {error && (
        <div className="form-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* reusable component for displaying prediction output */}
      <PredictionResult result={result} />
    </div>
  );
}