import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  incident: string;
  result: string;
}

function getAuditLogs(): AuditLog[] {
  const data = localStorage.getItem("cybermed_audit_logs");

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as AuditLog[];
  } catch {
    return [];
  }
}

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();

    const interval = setInterval(() => {
      loadLogs();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function loadLogs() {
    setLogs(getAuditLogs());
  }

  const filteredLogs = logs.filter((log) => {
    const text = `
      ${log.id}
      ${log.user}
      ${log.action}
      ${log.incident}
      ${log.result}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const successfulActions = logs.filter(
    (log) =>
      log.result === "Success" ||
      log.result === "Completed"
  ).length;

  const securityEvents = logs.filter(
    (log) => log.result === "Security Event"
  ).length;

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <p className="header-label">
            SYSTEM AUDIT
          </p>

          <h1>
            Audit Logs
          </h1>

          <p className="header-description">
            Review security actions and system activity.
          </p>
        </div>

        <div className="header-user">

          <div className="online-indicator"></div>

          <div className="user-details">
            <strong>
              Security Analyst
            </strong>

            <span>
              Authorized user
            </span>
          </div>

          <div className="user-avatar">
            SA
          </div>

        </div>

      </div>

      {/* SUMMARY CARDS */}
      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue">
            <FileText size={21} />
          </div>

          <div>
            <span>
              Total Events
            </span>

            <strong>
              {logs.length}
            </strong>

            <small>
              Recorded activities
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>
              Successful Actions
            </span>

            <strong>
              {successfulActions}
            </strong>

            <small>
              Completed successfully
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            <Activity size={21} />
          </div>

          <div>
            <span>
              System Actions
            </span>

            <strong>
              {logs.length}
            </strong>

            <small>
              Recorded activities
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>
              Security Events
            </span>

            <strong>
              {securityEvents}
            </strong>

            <small>
              Require attention
            </small>
          </div>

        </div>

      </section>

      {/* AUDIT LOG PANEL */}
      <section className="incidents-panel">

        <div className="panel-heading">

          <div>
            <h2>
              Recent Audit Activity
            </h2>

            <p>
              System and user actions recorded by the platform
            </p>
          </div>

          <div className="input-wrapper">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search audit logs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="incident-table">

          <div className="table-header">

            <span>
              Event
            </span>

            <span>
              User
            </span>

            <span>
              Action
            </span>

            <span>
              Status
            </span>

          </div>

          {filteredLogs.length === 0 ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              No audit events recorded yet.
            </div>

          ) : (

            filteredLogs.map((log) => (

              <div
                className="incident-row"
                key={log.id}
              >

                <div>

                  <strong>
                    {log.id}
                  </strong>

                  <small>
                    {log.incident} • {log.time}
                  </small>

                </div>

                <span>
                  {log.user}
                </span>

                <span>
                  {log.action}
                </span>

                <span
                  className={
                    log.result === "Success" ||
                    log.result === "Completed"
                      ? "incident-status resolved"
                      : "severity high"
                  }
                >
                  {log.result}
                </span>

              </div>

            ))

          )}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">

        <span>
          CyberMed Response
        </span>

        <span>
          Security Audit System
        </span>

        <span>
          Demo Environment
        </span>

      </footer>

    </div>
  );
}

export default AuditLogs;