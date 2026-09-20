import {
  ShieldAlert,
  Server,
  UserX,
  Globe,
  Lock,
  RefreshCw,
  CheckCircle,
  Clock,
  Activity,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getIncidents,
  updateIncidentStatus,
} from "../services/api";

interface ApiIncident {
  id: number;
  title: string;
  description?: string;
  severity: string;
  status: string;
  source?: string;
}

export default function ResponseCenter() {
  const [incidents, setIncidents] = useState<ApiIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] =
    useState<number | null>(null);

  // --------------------------------------------------
  // LOAD INCIDENTS FROM DATABASE
  // --------------------------------------------------

  async function loadIncidents() {
    try {
      setLoading(true);

      const data = await getIncidents();

      setIncidents(data);
    } catch (error) {
      console.error(
        "Failed to load response incidents:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  // --------------------------------------------------
  // RESOLVE INCIDENT
  // --------------------------------------------------

  async function handleResolve(incidentId: number) {
    try {
      setResolvingId(incidentId);

      await updateIncidentStatus(
        incidentId,
        "Resolved"
      );

      await loadIncidents();
    } catch (error) {
      console.error(
        "Failed to resolve incident:",
        error
      );

      alert(
        "Failed to resolve incident. Please make sure the backend is running."
      );
    } finally {
      setResolvingId(null);
    }
  }

  // --------------------------------------------------
  // FILTER INCIDENTS
  // --------------------------------------------------

  const activeIncidents = incidents.filter(
    (incident) =>
      incident.status === "In Response"
  );

  const investigatingIncidents = incidents.filter(
    (incident) =>
      incident.status === "Investigating" ||
      incident.status === "Open"
  );

  const containedIncidents = incidents.filter(
    (incident) =>
      incident.status === "Resolved"
  );

  const criticalResponses =
    activeIncidents.filter(
      (incident) =>
        incident.severity === "Critical"
    );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="module-page">

        <div className="module-header">

          <div>
            <div className="module-label">
              SECURITY OPERATIONS
            </div>

            <h1>
              Response Center
            </h1>

            <p>
              Coordinate and manage security
              response activities across
              healthcare systems.
            </p>
          </div>

          <div className="alert-header-icon">
            <ShieldAlert size={22} />
          </div>

        </div>

        <div className="details-card">
          <p>
            Loading response operations...
          </p>
        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // MAIN RESPONSE CENTER
  // --------------------------------------------------

  return (
    <div className="module-page">

      {/* HEADER */}
      <div className="module-header">

        <div>

          <div className="module-label">
            SECURITY OPERATIONS
          </div>

          <h1>
            Response Center
          </h1>

          <p>
            Coordinate and manage security
            response activities across
            healthcare systems.
          </p>

        </div>

        <div className="alert-header-icon">
          <ShieldAlert size={22} />
        </div>

      </div>

      {/* SUMMARY */}
      <div className="incident-summary">

        {/* CRITICAL RESPONSE */}
        <div className="summary-card">

          <div className="summary-icon critical-icon">
            <AlertTriangle size={20} />
          </div>

          <div>

            <span>
              Critical Response
            </span>

            <strong>
              {criticalResponses.length}
            </strong>

          </div>

        </div>

        {/* IN PROGRESS */}
        <div className="summary-card">

          <div className="summary-icon high-icon">
            <Activity size={20} />
          </div>

          <div>

            <span>
              In Progress
            </span>

            <strong>
              {activeIncidents.length}
            </strong>

          </div>

        </div>

        {/* AWAITING ACTION */}
        <div className="summary-card">

          <div className="summary-icon investigating-icon">
            <Clock size={20} />
          </div>

          <div>

            <span>
              Awaiting Action
            </span>

            <strong>
              {investigatingIncidents.length}
            </strong>

          </div>

        </div>

        {/* CONTAINED */}
        <div className="summary-card">

          <div className="summary-icon resolved-icon">
            <CheckCircle size={20} />
          </div>

          <div>

            <span>
              Contained
            </span>

            <strong>
              {containedIncidents.length}
            </strong>

          </div>

        </div>

      </div>

      {/* RESPONSE WORKSPACE */}
      <section className="incidents-container">

        <div className="panel-heading">

          <div>

            <h2>
              Active Response Queue
            </h2>

            <p>
              Security incidents currently
              requiring response coordination.
            </p>

          </div>

        </div>

        {/* NO ACTIVE RESPONSES */}
        {activeIncidents.length === 0 ? (

          <div className="details-card empty-response">

            <CheckCircle size={30} />

            <h3>
              No active response operations
            </h3>

            <p>
              Start a response from an
              incident's detail page to see
              it here.
            </p>

          </div>

        ) : (

          <div className="response-list">

            {activeIncidents.map(
              (incident) => {

                const incidentNumber =
                  `INC-${String(
                    incident.id
                  ).padStart(4, "0")}`;

                return (

                  <div
                    className="response-card"
                    key={incident.id}
                  >

                    {/* TOP */}
                    <div className="response-card-top">

                      <div>

                        <div className="response-id">
                          {incidentNumber}
                        </div>

                        <h3>
                          {incident.title}
                        </h3>

                        <p>
                          {incident.description ||
                            "No additional description provided."}
                        </p>

                      </div>

                      <span
                        className={`severity-badge ${
                          incident.severity.toLowerCase()
                        }`}
                      >
                        {incident.severity}
                      </span>

                    </div>

                    {/* INFORMATION */}
                    <div className="response-info">

                      <div>
                        <Server size={16} />

                        <span>
                          Healthcare System
                        </span>
                      </div>

                      <div>
                        <Activity size={16} />

                        <span>
                          {incident.source ||
                            "Security Monitor"}
                        </span>
                      </div>

                      <div>
                        <Clock size={16} />

                        <span>
                          Response Active
                        </span>
                      </div>

                      <span className="status-badge investigating">
                        In Response
                      </span>

                    </div>

                    {/* ACTIONS */}
                    <div className="response-actions">

                      <button
                        className="response-action-button"
                        type="button"
                      >
                        <Server size={16} />
                        Isolate Asset
                      </button>

                      <button
                        className="response-action-button"
                        type="button"
                      >
                        <Globe size={16} />
                        Block Network
                      </button>

                      <button
                        className="response-action-button"
                        type="button"
                      >
                        <UserX size={16} />
                        Disable Account
                      </button>

                      <button
                        className="response-action-button primary"
                        type="button"
                        onClick={() =>
                          handleResolve(
                            incident.id
                          )
                        }
                        disabled={
                          resolvingId ===
                          incident.id
                        }
                      >
                        <CheckCircle size={16} />

                        {resolvingId ===
                        incident.id
                          ? "Resolving..."
                          : "Mark Contained"}

                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* RESPONSE CONTROLS */}
      <section className="response-control-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Response Controls
            </h2>

            <p>
              Available security response
              operations.
            </p>

          </div>

        </div>

        <div className="response-control-grid">

          {/* ASSET ISOLATION */}
          <div className="control-card">

            <div className="control-icon">
              <Server size={20} />
            </div>

            <div>

              <strong>
                Asset Isolation
              </strong>

              <span>
                Temporarily isolate a selected
                asset from the monitored
                environment.
              </span>

            </div>

          </div>

          {/* NETWORK BLOCKING */}
          <div className="control-card">

            <div className="control-icon">
              <Globe size={20} />
            </div>

            <div>

              <strong>
                Network Blocking
              </strong>

              <span>
                Apply an authorized network
                containment action for an
                investigated event.
              </span>

            </div>

          </div>

          {/* ACCOUNT PROTECTION */}
          <div className="control-card">

            <div className="control-icon">
              <UserX size={20} />
            </div>

            <div>

              <strong>
                Account Protection
              </strong>

              <span>
                Restrict a suspicious account
                while an incident is
                investigated.
              </span>

            </div>

          </div>

          {/* RECOVERY */}
          <div className="control-card">

            <div className="control-icon">
              <RefreshCw size={20} />
            </div>

            <div>

              <strong>
                Recovery Workflow
              </strong>

              <span>
                Start the authorized recovery
                process after containment.
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* SECURITY NOTICE */}
      <div className="response-notice">

        <Lock size={18} />

        <div>

          <strong>
            Controlled Response Environment
          </strong>

          <span>
            Response actions are recorded
            for audit purposes and require
            appropriate authorization.
          </span>

        </div>

      </div>

    </div>
  );
}