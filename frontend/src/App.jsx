import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

// import all page/components used in the app
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
import HistoryPage from "./components/HistoryPage";

// main app component
export default function App() {
  // -------------------authentication and user state-----------------.
  const [session, setSession] = useState(null);

  // -------------------authentication form inputs-----------------.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // -------------------page + navigation state-----------------.
  const [activePage, setActivePage] = useState("home");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [pendingComponent, setPendingComponent] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  // list of maintenance compoents
  const components = [
    "Engine Oil",
    "Tyre",
    "Brakes",
    "Chain",
    "Brake Fluid",
    "Coolant",
  ];

  // -------------------check login status when app loasd-----------------.
  useEffect(() => {
    //gets session when app starts
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    //list for ligin/logout changes.
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    //cleanign up listener when component is unmounted
    return () => sub.subscription.unsubscribe();
  }, []);

  // -------------------sign up function-----------------.
  async function signUp() {
  setMsg(""); //clearing old mesages

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  //if singup failss
  if (error) {
    setMsg(error.message);
    return;
  }

  //if singup works
  setMsg("Account created. Please check your email to confirm before signing in.");
  setPassword(""); //clearing pw field
  setPendingComponent(""); //clear saved components
  setShowAuth(true); //stay on auth screen
  }

  // -------------------sign in function-----------------.
  async function signIn() {
    setMsg(""); //clearing old mesasages

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //if login works
    if (error) {
      setMsg(error.message);
      return;
    }

    const newSession = data?.session ?? null;
    setSession(newSession);
    setMsg("Signed in.");

    //if user chose a component before login in
    //take straight to chosen component/
    if (pendingComponent) {
      setSelectedComponent(pendingComponent);
      setPendingComponent("");
      setActivePage("dashboard");
    } else {
      setSelectedComponent("");
      setActivePage("dashboard");
    }

    setShowAuth(false); //hide auth form
  }


  // -------------------sign out function-----------------.
  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setSelectedComponent("");
    setPendingComponent("");
    setActivePage("home");
    setShowAuth(false);
    setMsg("Signed out.");
  }

  // -------------------user clicked get started----------------.
  function handleGetStarted() {
    setPendingComponent(""); //no svaed compnenent
    setShowAuth(true); //show auth form
    setActivePage("home");
    setMsg("");
  }

  //-------------------user selected component from landing page-----------------.
  function handlePublicComponentSelect(component) {
    setPendingComponent(component); //remember chosen component
    setShowAuth(true); //ask user to sign in first
    setActivePage("home");
    setMsg("");
  }

  // -----------------back to dashboard---------------.
  function handleBackToDashboard() {
    setSelectedComponent("");
    setActivePage("dashboard");
  }

  // -------------------go back from auth screen-----------------.
  function handleBackFromAuth() {
    setShowAuth(false);
    setPendingComponent("");
    setMsg("");
  }

  // -------------------shwo valid form for selected component.-----------------.
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

  // ------------------what the users sees wihtout being logged in-----------------.
  function renderPublicContent() {
    //if authentication form should be shown
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

    // otherwise show landing page
    return (
      <LandingPage
        components={components}
        onSelectComponent={handlePublicComponentSelect}
        onGetStarted={handleGetStarted}
      />
    );
  }

  
   // ------------------what the users sees being logged in-----------------.
  function renderPrivateContent() {
     // about page
    if (activePage === "about") {
      return <AboutPage />;
    }

    //history page
    if (activePage === "history") {
      return (
        <HistoryPage
          onOpenPrediction={(component) => {
            setSelectedComponent(component);
            setActivePage("dashboard");
          }}
        />
      );
    }

    //contact page
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

    //if user picks componetn show that form
    if (selectedComponent) {
      return renderSelectedComponentForm();
    }

    //default loggied in page is the dashboard
    return (
      <Dashboard
        components={components}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
    );
  }

   //------------------------main UI-------------------------.
  return (
    <div className="app-page">
      <div className="app-frame">
        {/* left sidebar */}
        <Sidebar
          isAuthenticated={!!session}
          userEmail={session?.user?.email ?? ""}
          activePage={activePage}
          setActivePage={setActivePage}
          signOut={signOut}
          setShowAuth={setShowAuth}
          setSelectedComponent={setSelectedComponent}
        />

        {/* main page content */}
        <main className="main-content">
          <div className="page-topbar">
            
            {/* app heading */}
            <div className="page-header">
              <p className="eyebrow">Motorbike Predictive Maintenance Platform</p>
              <h1 className="app-title">Motorbike Predictive Maintenance System</h1>
              {msg && <p className="status-message">{msg}</p>}
            </div>

            {/* top right sign in or user email */}
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