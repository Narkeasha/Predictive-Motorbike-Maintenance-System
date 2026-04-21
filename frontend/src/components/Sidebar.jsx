export default function Sidebar({
  isAuthenticated,
  userEmail,
  activePage,
  setActivePage,
  signOut,
  setShowAuth,
  setSelectedComponent,
}) {


  // -------------------- nav functions--------------------
  function goTo(page) {


    // if user NOT logged in
    if (!isAuthenticated) {
      setActivePage("home");
      setShowAuth(false);

      // scroll to home section
      if (page === "home") {
        setTimeout(() => {
          document
            .getElementById("home-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      // scroll to about section
      if (page === "about") {
        setTimeout(() => {
          document
            .getElementById("about-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      return;  // stop here if not logged in
    }

    // if user is logged in then change page normally
    setActivePage(page);

    // reset selected component when leaving dashboard
    if (page !== "dashboard" && setSelectedComponent) {
      setSelectedComponent("");
    }
  }

    // -------------------- UI --------------------
  return (
    <aside className="sidebar">
       {/* --------------logo/title--------------- */}
      <div className="sidebar-brand">
        <div className="brand-badge">nk</div>
        <div>
          <h2 className="sidebar-title">PMMS</h2>
          <p className="sidebar-subtitle">
            {isAuthenticated ? "Overview" : "Public navigation"}
          </p>
        </div>
      </div>


      {/* ----------------show email if logged in------ */}
      {isAuthenticated && (
        <div className="sidebar-user">
          <span className="sidebar-user-label">Signed in as</span>
          <strong className="sidebar-user-email">{userEmail}</strong>
        </div>
      )}


      {/* -----------------logged in view ------------------ */}
      {isAuthenticated ? (
        <>
          <nav className="sidebar-nav">

            {/* dashboard button */}
            <button
              className={`nav-button ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => goTo("dashboard")}
            >
              Dashboard
            </button>

            {/* history button */}
            <button
              className={`nav-button ${activePage === "history" ? "active" : ""}`}
              onClick={() => goTo("history")}
            >
              History
            </button>

           {/* support button */}
            <button
              className={`nav-button ${activePage === "contact" ? "active" : ""}`}
              onClick={() => goTo("contact")}
            >
              Support 
            </button>

            {/* about button */}
            <button
              className={`nav-button ${activePage === "about" ? "active" : ""}`}
              onClick={() => goTo("about")}
            >
              About
            </button>
          </nav>

          {/* sign out button */}
          <div className="sidebar-footer">
            <button className="nav-button nav-button-danger" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </>
      ) : (
         // --------------------view when not loggedd in----------------.
        <nav className="sidebar-nav">
           {/* home button */}
          <button className="nav-button" onClick={() => goTo("home")}>
            Home
          </button>

          {/* about button */}
          <button className="nav-button" onClick={() => goTo("about")}>
            About 
          </button>
        </nav>
      )}
    </aside>
  );
}