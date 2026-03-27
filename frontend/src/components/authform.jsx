import { useState } from "react";

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
  const [mode, setMode] = useState("signin");

  const isSignIn = mode === "signin";

  return (
    <div className="page-card auth-card">
      <div className="auth-header">
        <p className="eyebrow">Authentication</p>

        <h2 className="section-title">
          {isSignIn
            ? pendingComponent
              ? `Sign in to continue with ${pendingComponent}`
              : "Sign in to continue"
            : "Create your account"}
        </h2>

        <p className="section-subtitle">
          {isSignIn
            ? "Access the dashboard, open prediction forms, and manage maintenance workflows from one place."
            : "Set up your email and password to create an account and start using the predictive maintenance system."}
        </p>
      </div>

      <div className="auth-form-grid">
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

        <div className="auth-actions">
          {isSignIn ? (
            <>
              <button className="primary-button" onClick={signIn}>
                Sign In
              </button>

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
              <button className="primary-button" onClick={signUp}>
                Create Account
              </button>

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