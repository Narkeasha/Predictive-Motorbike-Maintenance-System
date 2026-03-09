import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";


//state variables ->   what UI remembers
const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [session, setSession] = useState(null);

  // auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // input payload (dummy for Phase 1)
  const [milesSinceService, setMilesSinceService] = useState(500);
  const [ridingStyle, setRidingStyle] = useState("normal");

  // outputs + history
  const [outputs, setOutputs] = useState(null);
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");

  // on load, gets session and listen for login/logout events
  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  //signup function that uses supabase auth to create account with email and password
  //if succesfull may need email comfirmation
  async function signUp() {
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Sign-up success. Check your email to confirm (if enabled).");
  }
//loging via supbase auth 
  async function signIn() {
    setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Signed in.");
    setSession(data?.session ?? null);
  }

  //wipes data whne user loggs out 
  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setOutputs(null);
    setLogs([]);
    setMsg("Signed out.");
  }


  //main end-to-end call . clears old messages, checks if user signed in, nuild payload from form,
  //React → Backend → Save to DB → Return JSON → Show UI 
  async function runPredict() {
    setMsg("");
    setOutputs(null);

    if (!session?.access_token) {
      setMsg("No session token. Please sign in.");
      return;
    }

    const payload = {
      miles_since_service: Number(milesSinceService),
      riding_style: ridingStyle,
    };

    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(`Predict failed: ${data?.detail || res.statusText}`);
      return;
    }

    setOutputs(data.outputs);
    setMsg("Prediction saved.");
    await loadLogs();
  }

  //fetch history , this si my history view.
  async function loadLogs() {
    if (!session?.access_token) return;

    const res = await fetch(`${API_BASE}/logs?limit=10`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(`Logs failed: ${data?.detail || res.statusText}`);
      return;
    }

    setLogs(data);
  }

  // load logs when session becomes available auto load history 
  useEffect(() => {
    if (session?.access_token) loadLogs();
  }, [session]);

  //what appears on screen 
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Predictive Motorbike Maintenance System Phase 1  </h1>

      {msg && <p><b>Status:</b> {msg}</p>}

      {!session ? (
        <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
          <h2>Login / Create Account</h2>
          <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
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
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={signIn}>Sign In</button>
              <button onClick={signUp}>Sign Up</button>
            </div>
          </div>
          <p style={{ marginTop: 10, color: "#666" }}>
            (For Phase 1, email confirmation required.)
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p>
              Signed in as <b>{session.user.email}</b>
            </p>
            <button onClick={signOut}>Sign Out</button>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h2>Input Form (Phase 1 Minimal)</h2>

            <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
              <label>
                Miles since last service:
                <input
                  type="number"
                  value={milesSinceService}
                  onChange={(e) => setMilesSinceService(e.target.value)}
                />
              </label>

              <label>
                Riding style:
                <select value={ridingStyle} onChange={(e) => setRidingStyle(e.target.value)}>
                  <option value="gentle">gentle</option>
                  <option value="normal">normal</option>
                  <option value="aggressive">aggressive</option>
                </select>
              </label>

              <button onClick={runPredict}>Run Predict (and Save)</button>
              <button onClick={loadLogs}>Refresh History</button>
            </div>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h2>Results</h2>
            {!outputs ? <p>No prediction yet.</p> : <pre>{JSON.stringify(outputs, null, 2)}</pre>}
          </div>

          <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h2>History (last 10)</h2>
            {logs.length === 0 ? (
              <p>No logs yet.</p>
            ) : (
              <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>created_at</th>
                    <th>inputs</th>
                    <th>outputs</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((row) => (
                    <tr key={row.id}>
                      <td>{row.created_at}</td>
                      <td><pre style={{ margin: 0 }}>{JSON.stringify(row.inputs, null, 2)}</pre></td>
                      <td><pre style={{ margin: 0 }}>{JSON.stringify(row.outputs, null, 2)}</pre></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
