import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function HistoryPage({ onOpenPrediction }) {
  const [records, setRecords] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError("Could not get user");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to fetch history");
      } else {
        setRecords(data);
      }

      setLoading(false);
    }

    fetchHistory();
  }, []);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-GB");
  }

  function formatLabel(key) {
    return key
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatValue(value) {
    return String(value).replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const latestByComponent = {};
  records.forEach((record) => {
    if (!latestByComponent[record.component]) {
      latestByComponent[record.component] = record;
    }
  });

  const components = Object.values(latestByComponent);

  const componentHistory = selectedComponent
    ? records.filter((record) => record.component === selectedComponent)
    : [];

  const latestRecord = componentHistory.length > 0 ? componentHistory[0] : null;

  if (loading) {
    return (
      <div className="page-card">
        <h2 className="section-title">Maintenance History</h2>
        <p className="section-subtitle">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-card">
        <h2 className="section-title">Maintenance History</h2>
        <p className="section-subtitle" style={{ color: "red" }}>
          {error}
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="page-card">
        <h2 className="section-title">Maintenance History</h2>
        <p className="section-subtitle">No history found.</p>
        <p className="section-subtitle">
          Go to the dashboard to generate your first prediction.
        </p>
      </div>
    );
  }

  // LEVEL 3 – full component history
  if (showFullHistory && selectedComponent) {
    return (
      <div className="page-card">
        <h2 className="section-title">{selectedComponent} History</h2>
        <p className="section-subtitle">
          Full prediction history for this component.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {componentHistory.map((record) => (
            <div
              key={record.id}
              style={{
                padding: "16px",
                border: "1px solid #d9dee5",
                borderRadius: "12px",
                backgroundColor: "#fff",
              }}
            >
              <p><strong>Date:</strong> {formatDate(record.created_at)}</p>
              <p><strong>Status:</strong> {record.outputs?.status}</p>
              <p>
                <strong>Recommendation:</strong>{" "}
                {record.outputs?.recommendation}
              </p>

              <div style={{ marginTop: "12px" }}>
                <strong>Inputs:</strong>
                <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
                  {Object.entries(record.inputs || {}).map(([key, value]) => (
                    <li key={key}>
                      {formatLabel(key)}: {formatValue(value)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button
            className="secondary-action-button"
            type="button"
            onClick={() => setShowFullHistory(false)}
          >
            Back to Summary
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 2 – latest component summary
  if (selectedComponent && latestRecord) {
    return (
      <div className="page-card">
        <h2 className="section-title">{selectedComponent}</h2>
        <p className="section-subtitle">
          Latest prediction summary for this component.
        </p>

        <div
          style={{
            padding: "16px",
            border: "1px solid #d9dee5",
            borderRadius: "12px",
            backgroundColor: "#fff",
            marginTop: "20px",
          }}
        >
          <p><strong>Date:</strong> {formatDate(latestRecord.created_at)}</p>
          <p><strong>Status:</strong> {latestRecord.outputs?.status}</p>
          <p>
            <strong>Recommendation:</strong>{" "}
            {latestRecord.outputs?.recommendation}
          </p>

          <div style={{ marginTop: "16px" }}>
            <strong>Inputs:</strong>
            <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
              {Object.entries(latestRecord.inputs || {}).map(([key, value]) => (
                <li key={key}>
                  {formatLabel(key)}: {formatValue(value)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="secondary-action-button"
            type="button"
            onClick={() => setSelectedComponent(null)}
          >
            Back
          </button>

          <button
            className="secondary-action-button"
            type="button"
            onClick={() => setShowFullHistory(true)}
          >
            View Previous Predictions
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() => onOpenPrediction?.(selectedComponent)}
          >
            Make New Prediction
          </button>
        </div>
      </div>
    );
  }

  // LEVEL 1 – overview
  return (
    <div className="page-card">
      <h2 className="section-title">Maintenance History</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {components.map((record) => (
          <div
            key={record.component}
            style={{
              padding: "16px",
              border: "1px solid #d9dee5",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
            onClick={() => {
              setSelectedComponent(record.component);
              setShowFullHistory(false);
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{record.component}</h3>
            <p style={{ margin: 0 }}>
              Last prediction: {formatDate(record.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}