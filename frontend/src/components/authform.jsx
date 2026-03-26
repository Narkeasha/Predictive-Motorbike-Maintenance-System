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
  return (
    <div className="page-card auth-card">
      <div className="auth-header">
        <p className="eyebrow">Authentication</p>
        <h2 className="section-title">
          {pendingComponent
            ? `Sign in to continue with ${pendingComponent}`
            : "Sign in to continue"}
        </h2>
        <p className="section-subtitle">
          Access the dashboard, open prediction forms, and manage maintenance
          workflows from one place.
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
          <button className="primary-button" onClick={signIn}>
            Sign In
          </button>
          <button className="secondary-button" onClick={signUp}>
            Sign Up
          </button>
          <button className="ghost-button" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}