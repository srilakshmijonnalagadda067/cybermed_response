import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LayoutDashboard,
  AlertTriangle,
  Bell,
  Activity,
  Server,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle,
} from "lucide-react";

import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import Alerts from "./pages/Alerts";
import Assets from "./pages/Assets";
import ResponseCenter from "./pages/ResponseCenter";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";

import { getIncidents } from "./services/api";

import "./App.css";


/* =========================================================
   DASHBOARD INCIDENT TYPE
========================================================= */

interface DashboardIncident {
  id: number;
  title: string;
  description?: string;
  severity: string;
  status: string;
  source?: string;
}


/* =========================================================
   APP
========================================================= */

function App() {

  /* =======================================================
     LOGIN STATE
  ======================================================= */

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  /* =======================================================
     PAGE NAVIGATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState("dashboard");


  /* =======================================================
     SELECTED INCIDENT
  ======================================================= */

  const [selectedIncidentId, setSelectedIncidentId] =
    useState<string | null>(null);


  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  const [dashboardIncidents, setDashboardIncidents] =
    useState<DashboardIncident[]>([]);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);


  /* =======================================================
     LOAD INCIDENTS FROM FASTAPI
  ======================================================= */

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    const loadDashboardIncidents = async () => {

      try {

        setDashboardLoading(true);

        const data = await getIncidents();

        setDashboardIncidents(data);

      } catch (error) {

        console.error(
          "Failed to load dashboard incidents:",
          error
        );

      } finally {

        setDashboardLoading(false);

      }

    };

    loadDashboardIncidents();

  }, [isLoggedIn]);


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setIsLoggedIn(true);

    setCurrentPage("dashboard");

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    setIsLoggedIn(false);

    setCurrentPage("dashboard");

  };


  /* =======================================================
     LOGIN PAGE
  ======================================================= */

  if (!isLoggedIn) {

    return (

      <div className="login-page">

        <div className="login-background">

          <div className="glow glow-one"></div>

          <div className="glow glow-two"></div>

        </div>


        <main className="login-container">


          {/* BRAND */}

          <section className="brand-section">

            <div className="brand-icon">

              <ShieldCheck
                size={42}
                strokeWidth={1.8}
              />

            </div>


            <h1>
              CyberMed Response
            </h1>


            <p className="brand-subtitle">
              Healthcare Cybersecurity & Incident Response
            </p>


            <div className="security-message">

              <ShieldCheck size={20} />

              <span>
                Protecting healthcare systems, data and
                patient-care continuity
              </span>

            </div>

          </section>


          {/* LOGIN CARD */}

          <section className="login-card">

            <div className="card-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to access the security operations
                platform
              </p>

            </div>


            <form onSubmit={handleLogin}>


              {/* EMAIL */}

              <div className="input-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    placeholder="security@hospital.org"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <Lock size={19} />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    required
                  />


                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* LOGIN OPTIONS */}

              <div className="login-options">

                <label className="remember">

                  <input type="checkbox" />

                  <span>
                    Remember me
                  </span>

                </label>


                <button
                  type="button"
                  className="forgot-button"
                >
                  Forgot password?
                </button>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-button"
              >
                Sign in securely
              </button>

            </form>


            <div className="login-footer">

              <ShieldCheck size={17} />

              <span>
                Authorized personnel only
              </span>

            </div>

          </section>


          {/* FOOTER */}

          <footer className="page-footer">

            <span>
              CyberMed Response
            </span>

            <span>
              •
            </span>

            <span>
              Healthcare Security Platform
            </span>

          </footer>

        </main>

      </div>

    );

  }


  /* =======================================================
     APPLICATION
  ======================================================= */

  return (

    <div className="dashboard-page">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="sidebar">


        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="sidebar-logo">

            <ShieldCheck size={27} />

          </div>


          <div>

            <h2>
              CyberMed
            </h2>

            <span>
              Response
            </span>

          </div>

        </div>


        {/* OPERATIONS */}

        <div className="sidebar-section-title">
          OPERATIONS
        </div>


        <nav className="sidebar-nav">


          {/* DASHBOARD */}

          <button
            className={`nav-item ${
              currentPage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("dashboard")
            }
          >

            <LayoutDashboard size={19} />

            Dashboard

          </button>


          {/* INCIDENTS */}

          <button
            className={`nav-item ${
              currentPage === "incidents" ||
              currentPage === "incident-details"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("incidents")
            }
          >

            <AlertTriangle size={19} />

            Incidents

            <span className="nav-count">
              {dashboardIncidents.length}
            </span>

          </button>


          {/* ALERTS */}

          <button
            className={`nav-item ${
              currentPage === "alerts"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("alerts")
            }
          >

            <Bell size={19} />

            Alerts

            <span className="nav-count">
              12
            </span>

          </button>


          {/* ASSETS */}

          <button
            className={`nav-item ${
              currentPage === "assets"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("assets")
            }
          >

            <Server size={19} />

            Assets

          </button>


          {/* RESPONSE CENTER */}

          <button
            className={`nav-item ${
              currentPage === "response"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("response")
            }
          >

            <Activity size={19} />

            Response Center

          </button>


          {/* REPORTS */}

          <button
            className={`nav-item ${
              currentPage === "reports"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("reports")
            }
          >

            <FileText size={19} />

            Reports

          </button>

        </nav>


        {/* SYSTEM */}

        <div className="sidebar-section-title">
          SYSTEM
        </div>


        <nav className="sidebar-nav">


          {/* AUDIT LOGS */}

          <button
            className={`nav-item ${
              currentPage === "audit"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("audit")
            }
          >

            <FileText size={19} />

            Audit Logs

          </button>


          {/* SETTINGS */}

          <button
            className={`nav-item ${
              currentPage === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentPage("settings")
            }
          >

            <SettingsIcon size={19} />

            Settings

          </button>

        </nav>


        {/* LOGOUT */}

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            Sign out

          </button>

        </div>

      </aside>


      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <main className="dashboard-main">


        {/* =================================================
            INCIDENTS
        ================================================= */}

        {currentPage === "incidents" ? (

          <Incidents
            onViewIncident={(incidentId) => {

              setSelectedIncidentId(incidentId);

              setCurrentPage(
                "incident-details"
              );

            }}
          />


        ) : currentPage === "incident-details" ? (


          /* =================================================
             INCIDENT DETAILS
          ================================================= */

          <IncidentDetails
            incidentId={selectedIncidentId}
            onBack={() =>
              setCurrentPage("incidents")
            }
          />


        ) : currentPage === "alerts" ? (


          /* =================================================
             ALERTS
          ================================================= */

          <Alerts />


        ) : currentPage === "assets" ? (


          /* =================================================
             ASSETS
          ================================================= */

          <Assets />


        ) : currentPage === "response" ? (


          /* =================================================
             RESPONSE CENTER
          ================================================= */

          <ResponseCenter />


        ) : currentPage === "reports" ? (


          /* =================================================
             REPORTS
          ================================================= */

          <Reports />


        ) : currentPage === "audit" ? (


          /* =================================================
             AUDIT LOGS
          ================================================= */

          <AuditLogs />


        ) : currentPage === "settings" ? (


          /* =================================================
             SETTINGS
          ================================================= */

          <Settings />


        ) : (


          /* =================================================
             DASHBOARD
          ================================================= */

          <>


            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <header className="dashboard-header">

              <div>

                <p className="header-label">
                  SECURITY OPERATIONS CENTER
                </p>

                <h1>
                  Security Dashboard
                </h1>

                <p className="header-description">
                  Monitor healthcare security events
                  and incident response.
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

            </header>


            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <section className="system-status">

              <div className="status-left">

                <span className="status-dot"></span>

                <strong>
                  All monitored systems operational
                </strong>

              </div>


              <span>
                Last updated: Just now
              </span>

            </section>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="stats-grid">


              {/* ACTIVE INCIDENTS */}

              <div className="stat-card">

                <div className="stat-icon blue">

                  <Bell size={21} />

                </div>


                <div>

                  <span>
                    Active Incidents
                  </span>

                  <strong>

                    {
                      dashboardIncidents.filter(
                        (incident) =>
                          incident.status.toLowerCase() !==
                          "resolved"
                      ).length
                    }

                  </strong>

                  <small>
                    Across monitored systems
                  </small>

                </div>

              </div>


              {/* HIGH PRIORITY */}

              <div className="stat-card">

                <div className="stat-icon red">

                  <AlertTriangle size={21} />

                </div>


                <div>

                  <span>
                    High Priority
                  </span>

                  <strong>

                    {
                      dashboardIncidents.filter(
                        (incident) => {

                          const severity =
                            incident.severity.toLowerCase();

                          return (
                            severity === "high" ||
                            severity === "critical"
                          );

                        }
                      ).length
                    }

                  </strong>

                  <small>
                    Require investigation
                  </small>

                </div>

              </div>


              {/* UNDER INVESTIGATION */}

              <div className="stat-card">

                <div className="stat-icon orange">

                  <Activity size={21} />

                </div>


                <div>

                  <span>
                    Under Investigation
                  </span>

                  <strong>

                    {
                      dashboardIncidents.filter(
                        (incident) => {

                          const status =
                            incident.status.toLowerCase();

                          return (
                            status === "investigating" ||
                            status === "in response"
                          );

                        }
                      ).length
                    }

                  </strong>

                  <small>
                    Active investigations
                  </small>

                </div>

              </div>


              {/* RESOLVED */}

              <div className="stat-card">

                <div className="stat-icon green">

                  <CheckCircle size={21} />

                </div>


                <div>

                  <span>
                    Resolved
                  </span>

                  <strong>

                    {
                      dashboardIncidents.filter(
                        (incident) =>
                          incident.status.toLowerCase() ===
                          "resolved"
                      ).length
                    }

                  </strong>

                  <small>
                    Successfully closed
                  </small>

                </div>

              </div>

            </section>


            {/* =================================================
                DASHBOARD CONTENT
            ================================================= */}

            <section className="dashboard-content">


              {/* =================================================
                  RECENT INCIDENTS
              ================================================= */}

              <div className="incidents-panel">


                <div className="panel-heading">

                  <div>

                    <h2>
                      Recent Security Incidents
                    </h2>

                    <p>
                      Latest events requiring security
                      attention
                    </p>

                  </div>


                  <button
                    className="view-all-button"
                    onClick={() =>
                      setCurrentPage("incidents")
                    }
                  >
                    View all
                  </button>

                </div>


                <div className="incident-table">


                  {/* TABLE HEADER */}

                  <div className="table-header">

                    <span>
                      Incident
                    </span>

                    <span>
                      Type
                    </span>

                    <span>
                      Severity
                    </span>

                    <span>
                      Status
                    </span>

                  </div>


                  {/* LOADING */}

                  {dashboardLoading ? (

                    <div className="empty-state">
                      Loading incidents...
                    </div>


                  ) : dashboardIncidents.length === 0 ? (


                    /* NO INCIDENTS */

                    <div className="empty-state">
                      No incidents found.
                    </div>


                  ) : (


                    /* REAL DATABASE INCIDENTS */

                    dashboardIncidents
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((incident) => {

                        const severity =
                          incident.severity
                            .charAt(0)
                            .toUpperCase() +
                          incident.severity
                            .slice(1)
                            .toLowerCase();


                        const status =
                          incident.status
                            .charAt(0)
                            .toUpperCase() +
                          incident.status
                            .slice(1)
                            .toLowerCase();


                        let statusClass =
                          "response";


                        if (
                          status.toLowerCase() ===
                          "resolved"
                        ) {

                          statusClass =
                            "resolved";

                        } else if (
                          status.toLowerCase() ===
                          "investigating"
                        ) {

                          statusClass =
                            "investigating";

                        }


                        return (

                          <div
                            className="incident-row"
                            key={incident.id}
                          >


                            <div>

                              <strong>
                                INC-
                                {String(
                                  incident.id
                                ).padStart(4, "0")}
                              </strong>

                              <small>
                                {incident.title}
                              </small>

                            </div>


                            <span>
                              {incident.source ||
                                "Security"}
                            </span>


                            <span
                              className={`severity ${severity.toLowerCase()}`}
                            >
                              {severity}
                            </span>


                            <span
                              className={`incident-status ${statusClass}`}
                            >
                              {status}
                            </span>

                          </div>

                        );

                      })

                  )}

                </div>

              </div>


              {/* =================================================
                  SYSTEM HEALTH
              ================================================= */}

              <div className="side-panel">


                <div className="panel-heading">

                  <div>

                    <h2>
                      System Health
                    </h2>

                    <p>
                      Monitored infrastructure
                    </p>

                  </div>

                </div>


                {/* HOSPITAL NETWORK */}

                <div className="health-item">

                  <div className="health-icon">

                    <Server size={19} />

                  </div>


                  <div>

                    <strong>
                      Hospital Network
                    </strong>

                    <span>
                      Operational
                    </span>

                  </div>


                  <i className="health-dot"></i>

                </div>


                {/* CLINICAL SYSTEMS */}

                <div className="health-item">

                  <div className="health-icon">

                    <Server size={19} />

                  </div>


                  <div>

                    <strong>
                      Clinical Systems
                    </strong>

                    <span>
                      Operational
                    </span>

                  </div>


                  <i className="health-dot"></i>

                </div>


                {/* MEDICAL DEVICES */}

                <div className="health-item">

                  <div className="health-icon">

                    <Server size={19} />

                  </div>


                  <div>

                    <strong>
                      Medical Devices
                    </strong>

                    <span>
                      Operational
                    </span>

                  </div>


                  <i className="health-dot"></i>

                </div>


                {/* PATIENT DATA */}

                <div className="health-item">

                  <div className="health-icon">

                    <Server size={19} />

                  </div>


                  <div>

                    <strong>
                      Patient Data Systems
                    </strong>

                    <span>
                      Operational
                    </span>

                  </div>


                  <i className="health-dot"></i>

                </div>

              </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="dashboard-footer">

              <span>
                CyberMed Response
              </span>

              <span>
                Healthcare Cybersecurity Platform
              </span>

              <span>
                Demo Environment
              </span>

            </footer>

          </>

        )}

      </main>

    </div>

  );

}


export default App;