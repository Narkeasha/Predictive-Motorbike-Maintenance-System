import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/dashboard";
import AboutPage from "./components/aboutpage";
import LandingPage from "./components/LandingPage";
import AuthForm from "./components/authform";

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

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setMsg(error.message);
    return;
  }

  setMsg("Account created. Please check your email to confirm before signing in.");
  setPassword("");
  setPendingComponent("");
  setShowAuth(true);
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

  function handleBackFromAuth() {
    setShowAuth(false);
    setPendingComponent("");
    setMsg("");
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
    if (showAuth) {
      return (
        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          signIn={signIn}
          signUp={signUp}
          onBack={handleBackFromAuth}
          pendingComponent={pendingComponent}
        />
      );
    }

    return (
      <LandingPage
        components={components}
        onSelectComponent={handlePublicComponentSelect}
        onGetStarted={handleGetStarted}
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
            Prediction history will be added sooonnn.
          </p>
        </div>
      );
    }

    if (activePage === "contact") {
      return (
        <section className="page-card support-card">
          <div className="support-header">
            <h2 className="section-title">Get in touch</h2>
            <p className="section-subtitle">
              Have a question, found an issue, or want to share feedback? You can
              contact me using the details below.
            </p>
          </div>

          <div className="support-contact-card">
            <h3 className="support-card-title">Contact details</h3>

            <p className="support-card-text">
              For questions about the system, feedback, or bug reports, please
              reach out via email:
            </p>

            <div className="support-contact-item">
              <span className="support-label">Email</span>
              <a
                href="mailto:s4216385@lsbu.ac.uk"
                className="support-link"
              >
                : s4216385@lsbu.ac.uk
              </a>
            </div>

            <p className="support-note">
              This is a student project, so response times may vary.
            </p>
          </div>

          <div className="support-disclaimer">
            <h3 className="support-card-title">Important notice</h3>
            <p>
              This system provides general maintenance guidance and estimated
              predictions only. It should not be treated as professional mechanical
              advice or a substitute for regular safety checks. If your bike shows
              serious faults or safety-critical issues, you should seek advice from
              a qualified mechanic or appropriate professional.
            </p>
          </div>
        </section>
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
          <div className="page-topbar">
            <div className="page-header">
              <p className="eyebrow">Motorbike Predictive Maintenance Platform</p>
              <h1 className="app-title">Motorbike Predictive Maintenance System</h1>
              {msg && <p className="status-message">{msg}</p>}
            </div>

            <div className="topbar-account">
              {!session ? (
                <button
                  className="secondary-button topbar-signin"
                  onClick={handleGetStarted}
                >
                  Sign In
                </button>
              ) : (
                <div className="signed-in-badge">
                  <span className="signed-in-label">Signed in as</span>
                  <strong className="signed-in-email">
                    {session?.user?.email}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {session ? renderPrivateContent() : renderPublicContent()}
        </main>
      </div>
    </div>
  );
}