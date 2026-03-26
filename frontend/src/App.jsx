import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

import AuthForm from "./components/authform";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/dashboard";
import AboutPage from "./components/aboutpage";
import LandingPage from "./components/LandingPage";

import EngineOilForm from "./components/EngineOilForm";
import TyreForm from "./components/TyreForm";
import BrakesForm from "./components/BrakesForm";
import ChainForm from "./components/ChainForm";
import BrakeFluidForm from "./components/BrakeFluidForm";
import CoolantForm from "./components/CoolantForm";

export default function App() {
  const [session, setSession] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [activePage, setActivePage] = useState("home");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [pendingComponent, setPendingComponent] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const components = [
    "Engine Oil",
    "Tyre",
    "Brakes",
    "Chain",
    "Brake Fluid",
    "Coolant",
  ];

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

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Sign-up success. Check your email to confirm (if enabled).");
    }
  }

  async function signIn() {
    setMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    const newSession = data?.session ?? null;
    setSession(newSession);
    setMsg("Signed in.");

    if (pendingComponent) {
      setSelectedComponent(pendingComponent);
      setPendingComponent("");
      setActivePage("dashboard");
    } else {
      setSelectedComponent("");
      setActivePage("dashboard");
    }

    setShowAuth(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setSelectedComponent("");
    setPendingComponent("");
    setActivePage("home");
    setShowAuth(false);
    setMsg("Signed out.");
  }

  function handleGetStarted() {
    setPendingComponent("");
    setShowAuth(true);
    setActivePage("home");
    setMsg("");
  }

  function handlePublicComponentSelect(component) {
    setPendingComponent(component);
    setShowAuth(true);
    setActivePage("home");
    setMsg("");
  }

  function handleBackToDashboard() {
    setSelectedComponent("");
    setActivePage("dashboard");
  }

  function renderSelectedComponentForm() {
    if (selectedComponent === "Engine Oil") {
      return <EngineOilForm onBack={handleBackToDashboard} />;
    }

    if (selectedComponent === "Tyre") {
      return <TyreForm onBack={handleBackToDashboard} />;
    }

    if (selectedComponent === "Brakes") {
      return <BrakesForm onBack={handleBackToDashboard} />;
    }

    if (selectedComponent === "Chain") {
      return <ChainForm onBack={handleBackToDashboard} />;
    }

    if (selectedComponent === "Brake Fluid") {
      return <BrakeFluidForm onBack={handleBackToDashboard} />;
    }

    if (selectedComponent === "Coolant") {
      return <CoolantForm onBack={handleBackToDashboard} />;
    }

    return null;
  }

  function renderPublicContent() {
  return (
    <LandingPage
      components={components}
      onSelectComponent={handlePublicComponentSelect}
      onGetStarted={handleGetStarted}
      showAuth={showAuth}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      signIn={signIn}
      signUp={signUp}
      pendingComponent={pendingComponent}
      onBackFromAuth={() => {
        setShowAuth(false);
        setPendingComponent("");
        setMsg("");
      }}
    />
  );
}

  function renderPrivateContent() {
    if (activePage === "about") {
      return <AboutPage />;
    }

    if (activePage === "history") {
      return (
        <div className="page-card">
          <h2 className="section-title">Logged History</h2>
          <p className="section-subtitle">
            Prediction history will be added in Phase 5.
          </p>
        </div>
      );
    }

    if (activePage === "contact") {
      return (
        <div className="page-card">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Support and contact details can be added here during final refinement.
          </p>
        </div>
      );
    }

    if (selectedComponent) {
      return renderSelectedComponentForm();
    }

    return (
      <Dashboard
        components={components}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
    );
  }

  return (
    <div className="app-page">
      <div className="app-frame">
        <Sidebar
          isAuthenticated={!!session}
          userEmail={session?.user?.email ?? ""}
          activePage={activePage}
          setActivePage={setActivePage}
          signOut={signOut}
          setShowAuth={setShowAuth}
          setSelectedComponent={setSelectedComponent}
        />

        <main className="main-content">
          <div className="page-header">
            <p className="eyebrow">Motorbike Predictive Maintenance Platform</p>
            <h1 className="app-title">Motorbike Predictive Maintenance System</h1>
            {msg && <p className="status-message">{msg}</p>}
          </div>

          {session ? renderPrivateContent() : renderPublicContent()}
        </main>
      </div>
    </div>
  );
}