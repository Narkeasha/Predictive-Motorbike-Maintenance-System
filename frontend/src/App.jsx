import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthForm from "./components/authform";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/dashboard";
import AboutPage from "./components/aboutpage";
import EngineOilForm from "./components/EngineOilForm";

export default function App() {
  const [session, setSession] = useState(null);

  // auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // navigation state
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedComponent, setSelectedComponent] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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

  function renderMainContent() {
    if (activePage === "about") {
      return <AboutPage />;
    }

    if (activePage === "dashboard") {
      if (selectedComponent === "Engine Oil") {
        return (
          <EngineOilForm onBack={() => setSelectedComponent("")} />
        );
      }

      return (
        <Dashboard
          components={components}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
      );
    }

    return null;
  }

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

      {msg && (
        <p>
          <b>Status:</b> {msg}
        </p>
      )}

      {!session ? (
        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          signIn={signIn}
          signUp={signUp}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <Sidebar
            userEmail={session.user.email}
            activePage={activePage}
            setActivePage={setActivePage}
            signOut={signOut}
          />

          <div style={{ display: "grid", gap: 16 }}>
            {renderMainContent()}
          </div>
        </div>
      )}
    </div>
  );
}