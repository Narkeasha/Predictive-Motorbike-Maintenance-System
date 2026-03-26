export default function Sidebar({
  isAuthenticated,
  userEmail,
  activePage,
  setActivePage,
  signOut,
  setShowAuth,
  setSelectedComponent,
}) {
  function goTo(page) {
    if (!isAuthenticated) {
      setActivePage("home");
      setShowAuth(false);

      if (page === "home") {
        setTimeout(() => {
          document
            .getElementById("home-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      if (page === "about") {
        setTimeout(() => {
          document
            .getElementById("about-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      return;
    }

    setActivePage(page);

    if (page !== "dashboard" && setSelectedComponent) {
      setSelectedComponent("");
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">nk</div>
        <div>
          <h2 className="sidebar-title">PMMS</h2>
          <p className="sidebar-subtitle">
            {isAuthenticated ? "Overview" : "Public navigation"}
          </p>
        </div>
      </div>

      {isAuthenticated && (
        <div className="sidebar-user">
          <span className="sidebar-user-label">Signed in as</span>
          <strong className="sidebar-user-email">{userEmail}</strong>
        </div>
      )}

      {isAuthenticated ? (
        <>
          <nav className="sidebar-nav">
            <button
              className={`nav-button ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => goTo("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`nav-button ${activePage === "history" ? "active" : ""}`}
              onClick={() => goTo("history")}
            >
              History
            </button>

            <button
              className={`nav-button ${activePage === "contact" ? "active" : ""}`}
              onClick={() => goTo("contact")}
            >
              Support 
            </button>

            <button
              className={`nav-button ${activePage === "about" ? "active" : ""}`}
              onClick={() => goTo("about")}
            >
              About
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="nav-button nav-button-danger" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <nav className="sidebar-nav">
          <button className="nav-button" onClick={() => goTo("home")}>
            Home
          </button>

          <button className="nav-button" onClick={() => goTo("about")}>
            About 
          </button>
        </nav>
      )}
    </aside>
  );
}