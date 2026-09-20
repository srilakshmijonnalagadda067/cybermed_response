import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Clock,
  Server,
  User,
  Activity,
  CheckCircle,
  Lock,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getIncidents,
  updateIncidentStatus,
} from "../services/api";

interface IncidentDetailsProps {
  incidentId: string | null;
  onBack: () => void;
}

interface ApiIncident {
  id: number;
  title: string;
  description?: string;
  severity: string;
  status: string;
  source?: string;
}

export default function IncidentDetails({
  incidentId,
  onBack,
}: IncidentDetailsProps) {
  const [incident, setIncident] =
    useState<ApiIncident | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [startingResponse, setStartingResponse] =
    useState(false);

  const [responseStarted, setResponseStarted] =
    useState(false);

  // --------------------------------------------------
  // LOAD INCIDENT
  // --------------------------------------------------

  useEffect(() => {
    // Always reset the response button when
    // opening a different incident.
    setResponseStarted(false);
    setLoading(true);

    async function loadIncident() {
      try {
        const incidents = await getIncidents();

        const numericId = Number(
          incidentId?.replace("INC-", "")
        );

        const found = incidents.find(
          (item: ApiIncident) =>
            item.id === numericId
        );

        setIncident(found || null);

      } catch (error) {
        console.error(
          "Failed to load incident:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadIncident();
  }, [incidentId]);

  // --------------------------------------------------
  // START RESPONSE
  // --------------------------------------------------

  async function handleStartResponse() {
    if (!incident) return;

    try {
      setStartingResponse(true);

      await updateIncidentStatus(
        incident.id,
        "In Response"
      );

      // Update the displayed incident
      setIncident({
        ...incident,
        status: "In Response",
      });

      // Now activate the response UI
      setResponseStarted(true);

    } catch (error) {
      console.error(
        "Failed to start response:",
        error
      );

      alert(
        "Failed to start response. Please make sure the backend is running."
      );
    } finally {
      setStartingResponse(false);
    }
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="incident-details-page">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Incidents
        </button>

        <div className="details-card">
          <p>
            Loading incident details...
          </p>
        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // INCIDENT NOT FOUND
  // --------------------------------------------------

  if (!incident) {
    return (
      <div className="incident-details-page">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Incidents
        </button>

        <div className="details-card">

          <div className="details-card-title">
            <AlertTriangle size={18} />
            Incident Not Found
          </div>

          <p>
            The selected incident could not be found
            in the database.
          </p>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // INCIDENT DISPLAY VALUES
  // --------------------------------------------------

  const incidentNumber =
    `INC-${String(
      incident.id
    ).padStart(4, "0")}`;

  const severity =
    incident.severity === "Critical"
      ? "Critical"
      : incident.severity === "High"
      ? "High"
      : incident.severity === "Low"
      ? "Low"
      : "Medium";

  /*
   * IMPORTANT:
   *
   * The displayed response status is controlled
   * by responseStarted.
   *
   * This prevents an old "In Response" value
   * in the database from automatically showing
   * "Response Active" when the page opens.
   */

  const status = responseStarted
    ? "In Response"
    : incident.status === "Resolved"
    ? "Resolved"
    : incident.status === "Under Review"
    ? "Under Review"
    : "Investigating";

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="incident-details-page">

      {/* ==================================================
          RESPONSE SUCCESS MESSAGE
          ================================================== */}

      {responseStarted && (
        <div className="response-success-message">

          <CheckCircle size={18} />

          <div>

            <strong>
              Response initiated
            </strong>

            <span>
              Containment and response actions are
              now active for this incident.
            </span>

          </div>

        </div>
      )}

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="details-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Incidents
        </button>

        <div className="incident-actions">

          <button className="secondary-action">
            Assign Analyst
          </button>

          <button
            className="primary-action"
            onClick={handleStartResponse}
            disabled={
              startingResponse ||
              responseStarted
            }
          >
            {startingResponse
              ? "Starting Response..."
              : responseStarted
              ? "Response Active"
              : "Start Response"}
          </button>

        </div>

      </div>

      {/* ==================================================
          INCIDENT TITLE
          ================================================== */}

      <section className="incident-title-card">

        <div className="incident-title-left">

          <div className="critical-large-icon">
            <AlertTriangle size={25} />
          </div>

          <div>

            <div className="details-label">
              SECURITY INCIDENT
            </div>

            <h1>
              {incidentNumber}
            </h1>

            <p>
              {incident.title}
            </p>

          </div>

        </div>

        <div className="incident-status-area">

          <span
            className={`severity-badge ${severity.toLowerCase()}`}
          >
            {severity}
          </span>

          <span
            className={`status-badge ${
              status
                .toLowerCase()
                .replace(" ", "-")
            }`}
          >
            {status}
          </span>

        </div>

      </section>

      {/* ==================================================
          INCIDENT OVERVIEW
          ================================================== */}

      <section className="details-grid">

        <div className="details-card">

          <div className="details-card-title">
            <Activity size={18} />
            Incident Overview
          </div>

          <div className="details-list">

            <div className="detail-row">

              <span>
                Incident Type
              </span>

              <strong>
                {incident.source ||
                  "Security"}
              </strong>

            </div>

            <div className="detail-row">

              <span>
                Detection Source
              </span>

              <strong>
                {incident.source ||
                  "Security Monitor"}
              </strong>

            </div>

            <div className="detail-row">

              <span>
                Current Status
              </span>

              <strong>
                {status}
              </strong>

            </div>

            <div className="detail-row">

              <span>
                Incident ID
              </span>

              <strong>
                {incidentNumber}
              </strong>

            </div>

          </div>

        </div>

        {/* ==================================================
            AFFECTED SYSTEM
            ================================================== */}

        <div className="details-card">

          <div className="details-card-title">
            <Server size={18} />
            Affected System
          </div>

          <div className="system-box">

            <div className="system-box-icon">
              <Server size={22} />
            </div>

            <div>

              <strong>
                Healthcare System
              </strong>

              <span>
                Security Infrastructure
              </span>

              <small>
                Monitoring active
              </small>

            </div>

            <span className="online-dot"></span>

          </div>

        </div>

      </section>

      {/* ==================================================
          DESCRIPTION
          ================================================== */}

      <section className="details-card threat-card">

        <div className="details-card-title">
          <Shield size={18} />
          Incident Description
        </div>

        <div className="threat-grid">

          <div>

            <span>
              Title
            </span>

            <strong>
              {incident.title}
            </strong>

          </div>

          <div>

            <span>
              Severity
            </span>

            <strong className="critical-text">
              {severity}
            </strong>

          </div>

          <div>

            <span>
              Source
            </span>

            <strong>
              {incident.source ||
                "Security Monitor"}
            </strong>

          </div>

          <div>

            <span>
              Description
            </span>

            <strong>
              {incident.description ||
                "No additional description provided."}
            </strong>

          </div>

        </div>

      </section>

      {/* ==================================================
          INVESTIGATION TIMELINE
          ================================================== */}

      <section className="details-card">

        <div className="details-card-title">
          <Clock size={18} />
          Investigation Timeline
        </div>

        <div className="timeline">

          {/* INCIDENT DETECTED */}

          <div className="timeline-item completed">

            <div className="timeline-icon">
              <CheckCircle size={15} />
            </div>

            <div>

              <strong>
                Incident detected
              </strong>

              <span>
                Security event was recorded by
                the monitoring system.
              </span>

              <small>
                Recently
              </small>

            </div>

          </div>

          {/* SECURITY ALERT */}

          <div className="timeline-item completed">

            <div className="timeline-icon">
              <Lock size={15} />
            </div>

            <div>

              <strong>
                Security alert generated
              </strong>

              <span>
                The event was added to the
                incident management system.
              </span>

              <small>
                Recently
              </small>

            </div>

          </div>

          {/* CURRENT STATUS */}

          <div className="timeline-item active">

            <div className="timeline-icon">
              <Activity size={15} />
            </div>

            <div>

              <strong>
                {status}
              </strong>

              <span>
                Security team can investigate
                the affected healthcare system.
              </span>

              <small>
                Current
              </small>

            </div>

          </div>

          {/* RESPONSE */}

          <div
            className={`timeline-item ${
              responseStarted
                ? "completed"
                : ""
            }`}
          >

            <div className="timeline-icon">

              {responseStarted ? (
                <CheckCircle size={15} />
              ) : (
                <Shield size={15} />
              )}

            </div>

            <div>

              <strong>
                {responseStarted
                  ? "Response active"
                  : "Response pending"}
              </strong>

              <span>
                {responseStarted
                  ? "Containment and response actions are now active."
                  : "Containment and response actions can be initiated by the security team."}
              </span>

              <small>
                {responseStarted
                  ? "Active"
                  : "Pending"}
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          ASSIGNED ANALYST
          ================================================== */}

      <section className="details-card">

        <div className="details-card-title">
          <User size={18} />
          Assigned Security Analyst
        </div>

        <div className="analyst-box">

          <div className="analyst-avatar">
            SA
          </div>

          <div>

            <strong>
              Security Analyst
            </strong>

            <span>
              Security Operations Center
            </span>

          </div>

          <span className="analyst-status">
            Active
          </span>

        </div>

      </section>

    </div>
  );
}