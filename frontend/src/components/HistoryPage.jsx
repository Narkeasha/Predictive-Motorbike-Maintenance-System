export default function HistoryPage() {
  return (
    <div className="page-card">
      <h2 className="section-title">Logged History</h2>

      <div className="history-list">
        <button className="history-item">
          Engine Oil
          <span className="history-date">Last predicted: 04 Apr 2026</span>
        </button>

        <button className="history-item">
          Tyre
          <span className="history-date">Last predicted: 02 Apr 2026</span>
        </button>
      </div>
    </div>
  );
}