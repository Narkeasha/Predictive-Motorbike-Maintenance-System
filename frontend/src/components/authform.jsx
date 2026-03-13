export default function AuthForm({
  email,
  password,
  setEmail,
  setPassword,
  signIn,
  signUp,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h2>Login / Create Account</h2>
        <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={signIn}>Sign In</button>
            <button onClick={signUp}>Sign Up</button>
          </div>
        </div>
        <p style={{ marginTop: 12, color: "#666" }}>
          Sign in to access the predictive maintenance dashboard.
        </p>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h2>Welcome</h2>
        <p>
          This system helps riders assess the condition of major motorbike
          components and receive maintenance recommendations before faults
          become severe.
        </p>
        <p>
          After login, you will be able to access the dashboard, choose a
          component, and later run maintenance predictions from the frontend.
        </p>
      </div>
    </div>
  );
}