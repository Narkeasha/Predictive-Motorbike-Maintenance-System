import { useState } from "react";

// this component handles both sign-in and sign-up UI
// it receives functions and state from App.jsx (parent component)
export default function AuthForm({
  email,
  password,
  setEmail,
  setPassword,
  signIn,
  signUp,
  onBack,
  pendingComponent,
}) {

  // local state to switch between sign-in and sign-up modes
  const [mode, setMode] = useState("signin");

   // helper boolean for cleaner conditional rendering
  const isSignIn = mode === "signin";

  return (
    <div className="page-card auth-card">
      {/* header section */}
      <div className="auth-header">
        <p className="eyebrow">Authentication</p>

        {/* dynamic title dependent o mode and selected component */}
        <h2 className="section-title">
          {isSignIn
            ? pendingComponent
              ? `Sign in to continue with ${pendingComponent}`
              : "Sign in to continue"
            : "Create your account"}
        </h2>

        {/* description changes based on mode */}
        <p className="section-subtitle">
          {isSignIn
            ? "Access the dashboard, open prediction forms, and manage maintenance workflows from one place."
            : "Set up your email and password to create an account and start using the predictive maintenance system."}
        </p>
      </div>

       {/* form inputs */}
      <div className="auth-form-grid">

        {/* email input */}
         {/* password input */}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="text-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="text-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* action buttons */}
        <div className="auth-actions">
           {/* SIGN IN MODE */}
          {isSignIn ? (
            <>
              {/* triggers sign-in function from App.jsx */}
              <button className="primary-button" onClick={signIn}>
                Sign In
              </button>

              {/* switch to sign-up mode */}
              <button
                className="secondary-action-button"
                type="button"
                onClick={() => setMode("signup")}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
               {/* SIGN UP MODE */}
              <button className="primary-button" onClick={signUp}>
                Create Account
              </button>

               {/* switch back to sign-in mode */}
              <button
                className="secondary-action-button"
                type="button"
                onClick={() => setMode("signin")}
              >
                Back to Sign In
              </button>
            </>
          )}

          <button className="ghost-button" onClick={onBack}>
            Back
          </button>
        </div>

      </div>
    </div>
  );
}