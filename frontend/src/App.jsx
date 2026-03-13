import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState(null);

  // auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // step 2 state
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedComponent, setSelectedComponent] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp() {
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Sign-up success. Check your email to confirm (if enabled).");
  }

  async function signIn() {
    setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else {
      setMsg("Signed in.");
      setSession(data?.session ?? null);
      setActivePage("dashboard");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setSelectedComponent("");
    setActivePage("dashboard");
    setMsg("Signed out.");
  }

  const components = [
    "Engine Oil",
    "Tyre",
    "Brakes",
    "Chain",
    "Brake Fluid",
    "Coolant",
  ];

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Motorbike Predictive Maintenance System</h1>

      {msg && <p><b>Status:</b> {msg}</p>}

      {!session ? (
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
              This system helps riders assess the condition of major motorbike components
              and receive maintenance recommendations before faults become severe.
            </p>
            <p>
              After login, you will be able to access the dashboard, choose a component,
              and later run maintenance predictions from the frontend.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Sidebar */}
          <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
            <h2 style={{ marginTop: 0 }}>Navigation</h2>

            <p style={{ fontSize: 14, color: "#555" }}>
              Signed in as <b>{session.user.email}</b>
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setActivePage("dashboard")}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: activePage === "dashboard" ? "bold" : "normal",
                }}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActivePage("about")}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: activePage === "about" ? "bold" : "normal",
                }}
              >
                About Us
              </button>

              <button
                onClick={signOut}
                style={{ padding: "10px 12px", cursor: "pointer", marginTop: 10 }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: "grid", gap: 16 }}>
            {activePage === "dashboard" && (
              <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
                <h2>Dashboard</h2>
                <p>Select a component to begin the prediction workflow.</p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  {components.map((component) => (
                    <button
                      key={component}
                      onClick={() => setSelectedComponent(component)}
                      style={{
                        padding: "16px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: selectedComponent === component ? "#e8f0fe" : "#fff",
                        cursor: "pointer",
                        fontWeight: selectedComponent === component ? "bold" : "normal",
                      }}
                    >
                      {component}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 24 }}>
                  {!selectedComponent ? (
                    <p>No component selected yet.</p>
                  ) : (
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: 16,
                        background: "#fafafa",
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>{selectedComponent}</h3>
                      <p>
                        This component has been selected successfully.
                      </p>
                      <p>
                        The prediction form for <b>{selectedComponent}</b> will be added in the next step.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activePage === "about" && (
              <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
                <h2>About Us</h2>
                <p>
                  The Motorbike Predictive Maintenance System is designed to support riders
                  in identifying potential maintenance issues before they become critical.
                </p>
                <p>
                  The system combines machine learning models and rule-based logic to assess
                  the condition of important motorbike components and return simple maintenance
                  guidance through the frontend interface.
                </p>
                <p>The system supports prediction and maintenance recommendations for:</p>
                <ul>
                  <li>Engine Oil</li>
                  <li>Tyre</li>
                  <li>Brakes</li>
                  <li>Chain</li>
                  <li>Brake Fluid</li>
                  <li>Coolant</li>
                </ul>
                <p>
                  The main goal of the system is to provide users with an accessible way to
                  enter maintenance-related data and receive a clear result in the form of:
                  <b> Safe</b>, <b>Warning</b>, or <b>Critical</b>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}