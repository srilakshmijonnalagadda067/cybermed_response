import {
  Search,
  Filter,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Alert {
  id: string;
  title: string;
  source: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "New" | "Acknowledged" | "Investigating" | "Resolved";
  affectedSystem: string;
  detected: string;
}

const defaultAlerts: Alert[] = [
  {
    id: "ALT-2026-0128",
    title: "Multiple failed authentication attempts",
    source: "Authentication Monitor",
    severity: "Critical",
    status: "New",
    affectedSystem: "Hospital Network",
    detected: "5 minutes ago",
  },
  {
    id: "ALT-2026-0127",
    title: "Unusual outbound network traffic",
    source: "Network IDS",
    severity: "High",
    status: "Acknowledged",
    affectedSystem: "Clinical Systems",
    detected: "18 minutes ago",
  },
  {
    id: "ALT-2026-0126",
    title: "Suspicious executable detected",
    source: "Endpoint Security",
    severity: "High",
    status: "Investigating",
    affectedSystem: "Medical Devices",
    detected: "32 minutes ago",
  },
  {
    id: "ALT-2026-0125",
    title: "Unexpected database access",
    source: "Database Monitor",
    severity: "Medium",
    status: "New",
    affectedSystem: "Patient Data Systems",
    detected: "1 hour ago",
  },
  {
    id: "ALT-2026-0124",
    title: "Repeated login failure",
    source: "Authentication Monitor",
    severity: "Medium",
    status: "Resolved",
    affectedSystem: "Staff Portal",
    detected: "2 hours ago",
  },
  {
    id: "ALT-2026-0123",
    title: "Endpoint policy violation",
    source: "Endpoint Security",
    severity: "Low",
    status: "Resolved",
    affectedSystem: "Administration Network",
    detected: "4 hours ago",
  },
];

const STORAGE_KEY = "cybermed_security_alerts";

function severityClass(severity: Alert["severity"]) {
  return severity.toLowerCase();
}

function statusClass(status: Alert["status"]) {
  return status.toLowerCase();
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notification, setNotification] = useState(false);

  // Load alerts from browser storage
  useEffect(() => {
    const savedAlerts = localStorage.getItem(STORAGE_KEY);

    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch {
        setAlerts(defaultAlerts);
      }
    } else {
      setAlerts(defaultAlerts);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultAlerts)
      );
    }
  }, []);

  // Save alerts whenever they change
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(alerts)
      );
    }
  }, [alerts]);

  // Generate one test security event
  const generateTestSecurityEvent = () => {
    const newAlert: Alert = {
      id: `ALT-TEST-${Date.now().toString().slice(-6)}`,
      title: "Multiple failed login attempts detected",
      source: "Authentication Monitor",
      severity: "Critical",
      status: "New",
      affectedSystem: "Clinical Systems",
      detected: "Just now",
    };

    setAlerts((currentAlerts) => {
      // Prevent accidental duplicate ID
      const alreadyExists = currentAlerts.some(
        (alert) => alert.id === newAlert.id
      );

      if (alreadyExists) {
        return currentAlerts;
      }

      return [newAlert, ...currentAlerts];
    });

    // Show notification
    setNotification(true);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      alert.title.toLowerCase().includes(searchText) ||
      alert.id.toLowerCase().includes(searchText) ||
      alert.source.toLowerCase().includes(searchText) ||
      alert.affectedSystem.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || alert.severity === filter;

    return matchesSearch && matchesFilter;
  });

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highCount = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const newCount = alerts.filter(
    (alert) => alert.status === "New"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  return (
    <div className="module-page">

      {/* NOTIFICATION */}
      {notification && (
        <div className="response-success-message">

          <Bell size={20} />

          <div>
            <strong>
              New Security Alert Detected
            </strong>

            <span>
              Critical authentication activity detected
              in Clinical Systems.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setNotification(false)}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* HEADER */}
      <div className="module-header">

        <div>

          <div className="module-label">
            SECURITY OPERATIONS
          </div>

          <h1>Security Alerts</h1>

          <p>
            Monitor and triage security alerts
            generated across healthcare systems.
          </p>

        </div>

        <div className="alert-header-actions">

          {/* ONLY ONE BUTTON */}
          <button
            type="button"
            className="test-event-button"
            onClick={generateTestSecurityEvent}
          >
            <Plus size={17} />
            Generate Test Security Event
          </button>

          <div className="alert-header-icon">
            <Bell size={22} />
          </div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="incident-summary">

        {/* CRITICAL */}
        <div className="summary-card">

          <div className="summary-icon critical-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>

        </div>

        {/* HIGH */}
        <div className="summary-card">

          <div className="summary-icon high-icon">
            <ShieldAlert size={20} />
          </div>

          <div>
            <span>High Priority</span>
            <strong>{highCount}</strong>
          </div>

        </div>

        {/* NEW */}
        <div className="summary-card">

          <div className="summary-icon investigating-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>New Alerts</span>
            <strong>{newCount}</strong>
          </div>

        </div>

        {/* RESOLVED */}
        <div className="summary-card">

          <div className="summary-icon resolved-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>

        </div>

      </div>

      {/* ALERT TABLE */}
      <section className="incidents-container">

        {/* TOOLBAR */}
        <div className="incidents-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="alert-filter">

            <Filter size={16} />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >

              <option value="All">
                All Alerts
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>

        </div>

        {/* TABLE */}
        <div className="incidents-table-wrapper">

          <table className="incidents-table">

            <thead>

              <tr>
                <th>Alert</th>
                <th>Source</th>
                <th>Affected System</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Detected</th>
              </tr>

            </thead>

            <tbody>

              {filteredAlerts.map((alert) => (

                <tr key={alert.id}>

                  <td>

                    <div className="incident-name">

                      <strong>
                        {alert.id}
                      </strong>

                      <span>
                        {alert.title}
                      </span>

                    </div>

                  </td>

                  <td>
                    {alert.source}
                  </td>

                  <td>
                    {alert.affectedSystem}
                  </td>

                  <td>

                    <span
                      className={`severity-badge ${severityClass(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`status-badge ${statusClass(
                        alert.status
                      )}`}
                    >
                      {alert.status}
                    </span>

                  </td>

                  <td>
                    {alert.detected}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredAlerts.length === 0 && (
            <div className="empty-state">
              No alerts found.
            </div>
          )}

        </div>

      </section>

    </div>
  );
}