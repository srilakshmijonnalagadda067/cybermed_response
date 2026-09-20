import {
  User,
  Bell,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

function Settings() {
  const [fullName, setFullName] = useState("Security Analyst");
  const [email, setEmail] = useState("security@hospital.org");

  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [incidentUpdates, setIncidentUpdates] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("cybermed_full_name", fullName);
    localStorage.setItem("cybermed_email", email);
    localStorage.setItem(
      "cybermed_critical_alerts",
      String(criticalAlerts)
    );
    localStorage.setItem(
      "cybermed_incident_updates",
      String(incidentUpdates)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <p className="header-label">
            SYSTEM CONFIGURATION
          </p>

          <h1>
            Settings
          </h1>

          <p className="header-description">
            Manage platform preferences and security settings.
          </p>
        </div>

        <div className="header-user">

          <div className="online-indicator"></div>

          <div className="user-details">
            <strong>
              {fullName}
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

      {/* SUCCESS MESSAGE */}
      {saved && (
        <div className="response-success-message">
          <CheckCircle size={20} />

          <div>
            <strong>
              Settings saved successfully
            </strong>

            <span>
              Your account and notification preferences have been updated.
            </span>
          </div>
        </div>
      )}

      {/* SETTINGS GRID */}
      <section className="dashboard-content">

        {/* ACCOUNT SETTINGS */}
        <div className="incidents-panel">

          <div className="panel-heading">

            <div>
              <h2>
                Account Settings
              </h2>

              <p>
                Manage your security analyst account.
              </p>
            </div>

            <User size={22} />

          </div>

          <div className="input-group">

            <label>
              Full Name
            </label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

          </div>

          <div className="input-group">

            <label>
              Email Address
            </label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

          </div>

          <button
            className="login-button"
            onClick={handleSave}
          >
            <Save size={18} />

            Save Changes
          </button>

        </div>

        {/* SECURITY SETTINGS */}
        <div className="side-panel">

          <div className="panel-heading">

            <div>
              <h2>
                Security
              </h2>

              <p>
                Platform security preferences.
              </p>
            </div>

            <ShieldCheck size={22} />

          </div>

          <div className="health-item">

            <div className="health-icon">
              <Lock size={19} />
            </div>

            <div>
              <strong>
                Multi-Factor Authentication
              </strong>

              <span>
                Enabled
              </span>
            </div>

            <i className="health-dot"></i>

          </div>

          <div className="health-item">

            <div className="health-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <strong>
                Session Protection
              </strong>

              <span>
                Active
              </span>
            </div>

            <i className="health-dot"></i>

          </div>

        </div>

      </section>

      {/* NOTIFICATIONS */}
      <section className="incidents-panel">

        <div className="panel-heading">

          <div>
            <h2>
              Notification Preferences
            </h2>

            <p>
              Choose which security notifications you receive.
            </p>
          </div>

          <Bell size={22} />

        </div>

        {/* CRITICAL ALERTS */}
        <div className="health-item">

          <div className="health-icon">
            <Bell size={19} />
          </div>

          <div>
            <strong>
              Critical Security Alerts
            </strong>

            <span>
              Receive notifications for critical incidents
            </span>
          </div>

          <input
            type="checkbox"
            checked={criticalAlerts}
            onChange={(e) =>
              setCriticalAlerts(e.target.checked)
            }
          />

        </div>

        {/* INCIDENT UPDATES */}
        <div className="health-item">

          <div className="health-icon">
            <Bell size={19} />
          </div>

          <div>
            <strong>
              Incident Updates
            </strong>

            <span>
              Receive updates when incidents change status
            </span>
          </div>

          <input
            type="checkbox"
            checked={incidentUpdates}
            onChange={(e) =>
              setIncidentUpdates(e.target.checked)
            }
          />

        </div>

      </section>

      {/* FOOTER */}
      <footer className="dashboard-footer">

        <span>
          CyberMed Response
        </span>

        <span>
          Platform Settings
        </span>

        <span>
          Demo Environment
        </span>

      </footer>

    </div>
  );
}

export default Settings;