import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getIncidents, createIncident } from "../services/api";

interface Incident {
  id: string;
  title: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Investigating" | "In Response" | "Under Review" | "Resolved";
  affectedSystem: string;
  detected: string;
}

interface ApiIncident {
  id: number;
  title: string;
  description?: string;
  severity: string;
  status: string;
  source?: string;
}

interface IncidentsProps {
  onViewIncident: (incidentId: string) => void;
}

function convertIncident(incident: ApiIncident): Incident {
  let status: Incident["status"] = "Investigating";

  if (incident.status === "Resolved") {
    status = "Resolved";
  } else if (incident.status === "In Response") {
    status = "In Response";
  } else if (incident.status === "Under Review") {
    status = "Under Review";
  }

  let severity: Incident["severity"] = "Medium";

  if (
    incident.severity === "Critical" ||
    incident.severity === "High" ||
    incident.severity === "Medium" ||
    incident.severity === "Low"
  ) {
    severity = incident.severity;
  }

  return {
    id: `INC-${String(incident.id).padStart(4, "0")}`,
    title: incident.title,
    type: incident.source || "Security",
    severity,
    status,
    affectedSystem: "Healthcare System",
    detected: "Recently",
  };
}

function severityClass(severity: Incident["severity"]) {
  return severity.toLowerCase();
}

function statusClass(status: Incident["status"]) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default function Incidents({
  onViewIncident,
}: IncidentsProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "Medium",
    status: "Investigating",
    source: "",
  });

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents();

        const converted = data.map(
          (incident: ApiIncident) => convertIncident(incident)
        );

        setIncidents(converted);
      } catch (err) {
        console.error(err);
        setError("Unable to load incidents from the server.");
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  async function handleCreateIncident() {
    if (!newIncident.title.trim()) {
      setError("Please enter an incident title.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createIncident(newIncident);

      const data = await getIncidents();

      const converted = data.map(
        (incident: ApiIncident) => convertIncident(incident)
      );

      setIncidents(converted);

      setNewIncident({
        title: "",
        description: "",
        severity: "Medium",
        status: "Investigating",
        source: "",
      });

      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setError("Unable to create incident.");
    } finally {
      setCreating(false);
    }
  }

  const criticalCount = incidents.filter(
    (incident) => incident.severity === "Critical"
  ).length;

  const highCount = incidents.filter(
    (incident) => incident.severity === "High"
  ).length;

  const investigatingCount = incidents.filter(
    (incident) => incident.status === "Investigating"
  ).length;

  const resolvedCount = incidents.filter(
    (incident) => incident.status === "Resolved"
  ).length;

  return (
    <div className="module-page">

      {/* HEADER */}
      <div className="module-header">
        <div>
          <div className="module-label">
            SECURITY OPERATIONS
          </div>

          <h1>Security Incidents</h1>

          <p>
            Monitor, investigate and manage cybersecurity
            incidents across healthcare systems.
          </p>
        </div>

        <button
          className="primary-action"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={17} />
          Create Incident
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="incident-summary">

        <div className="summary-card">
          <div className="summary-icon critical-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon high-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>High Priority</span>
            <strong>{highCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon investigating-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>Investigating</span>
            <strong>{investigatingCount}</strong>
          </div>
        </div>

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

      {/* CREATE INCIDENT FORM */}
      {showCreateForm && (
        <div className="create-incident-panel">

          <div className="create-incident-header">
            <div>
              <h2>Create Security Incident</h2>
              <p>
                Record a new cybersecurity incident.
              </p>
            </div>

            <button
              className="filter-button"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>

          <div className="create-incident-form">

            <div className="form-field">
              <label>Incident Title</label>

              <input
                type="text"
                placeholder="Example: Unauthorized login attempt"
                value={newIncident.title}
                onChange={(e) =>
                  setNewIncident({
                    ...newIncident,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-field">
              <label>Description</label>

              <textarea
                placeholder="Describe what happened..."
                value={newIncident.description}
                onChange={(e) =>
                  setNewIncident({
                    ...newIncident,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">

              <div className="form-field">
                <label>Severity</label>

                <select
                  value={newIncident.severity}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      severity: e.target.value,
                    })
                  }
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-field">
                <label>Source</label>

                <input
                  type="text"
                  placeholder="Example: Authentication Monitor"
                  value={newIncident.source}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      source: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <button
              className="primary-action"
              onClick={handleCreateIncident}
              disabled={creating}
            >
              <Plus size={17} />

              {creating
                ? "Creating..."
                : "Create Incident"}
            </button>

          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* INCIDENT TABLE */}
      <section className="incidents-container">

        {/* TOOLBAR */}
        <div className="incidents-toolbar">

          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search incidents..."
            />
          </div>

          <button className="filter-button">
            <Filter size={16} />
            Filter
          </button>

        </div>

        {/* TABLE */}
        <div className="incidents-table-wrapper">

          <table className="incidents-table">

            <thead>
              <tr>
                <th>Incident</th>
                <th>Type</th>
                <th>Affected System</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Detected</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={7}>
                    Loading incidents...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7}>
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                incidents.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      No incidents found.
                    </td>
                  </tr>
                )}

              {!loading &&
                !error &&
                incidents.map((incident) => (
                  <tr key={incident.id}>

                    <td>
                      <div className="incident-name">
                        <strong>
                          {incident.id}
                        </strong>

                        <span>
                          {incident.title}
                        </span>
                      </div>
                    </td>

                    <td>
                      {incident.type}
                    </td>

                    <td>
                      {incident.affectedSystem}
                    </td>

                    <td>
                      <span
                        className={`severity-badge ${severityClass(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${statusClass(
                          incident.status
                        )}`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    <td>
                      {incident.detected}
                    </td>

                    <td>
                      <button
                        className="view-incident"
                        onClick={() => onViewIncident(incident.id)}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>
      </section>

    </div>
  );
}