export default function Sidebar({
  userEmail,
  activePage,
  setActivePage,
  signOut,
}) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>Navigation</h2>

      <p style={{ fontSize: 14, color: "#555" }}>
        Signed in as <b>{userEmail}</b>
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
  );
}