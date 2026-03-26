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

      if (page === "home") {
        setShowAuth(false);
        setTimeout(() => {
          document
            .getElementById("home-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      if (page === "about") {
        setShowAuth(false);
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
        <div className="brand-badge">MP</div>
        <div>
          <h2 className="sidebar-title">Maintenance App</h2>
          <p className="sidebar-subtitle">
            {isAuthenticated ? "User workspace" : "Public navigation"}
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
              Logged History
            </button>

            <button
              className={`nav-button ${activePage === "contact" ? "active" : ""}`}
              onClick={() => goTo("contact")}
            >
              Contact Us
            </button>

            <button
              className={`nav-button ${activePage === "about" ? "active" : ""}`}
              onClick={() => goTo("about")}
            >
              About Us
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
            About Us
          </button>
        </nav>
      )}
    </aside>
  );
}