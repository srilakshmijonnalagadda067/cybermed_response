import {
  Search,
  Filter,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  network: string;
  risk: "Critical" | "High" | "Medium" | "Low";
  status: "Online" | "Warning" | "Offline";
  lastMonitored: string;
}

const assets: Asset[] = [
  {
    id: "AST-2026-001",
    name: "Hospital Core Server",
    type: "Server",
    location: "Main Data Center",
    network: "10.10.1.10",
    risk: "Critical",
    status: "Online",
    lastMonitored: "1 minute ago",
  },
  {
    id: "AST-2026-002",
    name: "Clinical Information System",
    type: "Clinical System",
    location: "Clinical Wing",
    network: "10.10.2.15",
    risk: "High",
    status: "Online",
    lastMonitored: "3 minutes ago",
  },
  {
    id: "AST-2026-003",
    name: "MRI Monitoring Device",
    type: "Medical Device",
    location: "Radiology Department",
    network: "10.10.3.21",
    risk: "High",
    status: "Warning",
    lastMonitored: "7 minutes ago",
  },
  {
    id: "AST-2026-004",
    name: "Patient Data Server",
    type: "Database Server",
    location: "Secure Data Center",
    network: "10.10.4.30",
    risk: "Critical",
    status: "Online",
    lastMonitored: "2 minutes ago",
  },
  {
    id: "AST-2026-005",
    name: "Staff Portal",
    type: "Web Application",
    location: "Administration",
    network: "10.10.5.40",
    risk: "Medium",
    status: "Online",
    lastMonitored: "12 minutes ago",
  },
  {
    id: "AST-2026-006",
    name: "Network Gateway",
    type: "Network Device",
    location: "Network Operations",
    network: "10.10.6.1",
    risk: "Medium",
    status: "Online",
    lastMonitored: "5 minutes ago",
  },
  {
    id: "AST-2026-007",
    name: "Pharmacy Workstation",
    type: "Workstation",
    location: "Pharmacy",
    network: "10.10.7.25",
    risk: "Low",
    status: "Offline",
    lastMonitored: "25 minutes ago",
  },
];

function riskClass(risk: Asset["risk"]) {
  return risk.toLowerCase();
}

function statusClass(status: Asset["status"]) {
  return status.toLowerCase();
}

export default function Assets() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  /* ---------------------------------
     FILTER ASSETS
  ---------------------------------- */

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        asset.id.toLowerCase().includes(searchText) ||
        asset.name.toLowerCase().includes(searchText) ||
        asset.type.toLowerCase().includes(searchText) ||
        asset.location.toLowerCase().includes(searchText) ||
        asset.network.toLowerCase().includes(searchText);

      const matchesRisk =
        riskFilter === "All" ||
        asset.risk === riskFilter;

      const matchesStatus =
        statusFilter === "All" ||
        asset.status === statusFilter;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesStatus
      );
    });
  }, [search, riskFilter, statusFilter]);

  /* ---------------------------------
     SUMMARY COUNTS
  ---------------------------------- */

  const totalAssets = assets.length;

  const onlineAssets = assets.filter(
    (asset) => asset.status === "Online"
  ).length;

  const warningAssets = assets.filter(
    (asset) => asset.status === "Warning"
  ).length;

  const criticalAssets = assets.filter(
    (asset) => asset.risk === "Critical"
  ).length;

  /* ---------------------------------
     CLEAR FILTERS
  ---------------------------------- */

  const clearFilters = () => {
    setSearch("");
    setRiskFilter("All");
    setStatusFilter("All");
  };

  const hasActiveFilters =
    search !== "" ||
    riskFilter !== "All" ||
    statusFilter !== "All";

  return (
    <div className="module-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="module-header">

        <div>

          <div className="module-label">
            SECURITY OPERATIONS
          </div>

          <h1>Protected Assets</h1>

          <p>
            Monitor healthcare systems, medical devices,
            servers and critical infrastructure.
          </p>

        </div>

        <div className="alert-header-icon">
          <Server size={22} />
        </div>

      </div>

      {/* =================================
          SUMMARY CARDS
      ================================= */}

      <div className="incident-summary">

        {/* TOTAL ASSETS */}

        <div className="summary-card">

          <div className="summary-icon">
            <Server size={20} />
          </div>

          <div>
            <span>Total Assets</span>
            <strong>{totalAssets}</strong>
          </div>

        </div>

        {/* ONLINE */}

        <div className="summary-card">

          <div className="summary-icon resolved-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Online</span>
            <strong>{onlineAssets}</strong>
          </div>

        </div>

        {/* WARNINGS */}

        <div className="summary-card">

          <div className="summary-icon investigating-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>Warnings</span>
            <strong>{warningAssets}</strong>
          </div>

        </div>

        {/* CRITICAL RISK */}

        <div className="summary-card">

          <div className="summary-icon critical-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Critical Risk</span>
            <strong>{criticalAssets}</strong>
          </div>

        </div>

      </div>

      {/* =================================
          ASSETS CONTAINER
      ================================= */}

      <section className="incidents-container">

        {/* =================================
            TOOLBAR
        ================================= */}

        <div className="incidents-toolbar">

          {/* SEARCH */}

          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={15} />
              </button>
            )}

          </div>

          {/* FILTER BUTTON */}

          <button
            type="button"
            className="filter-button"
            onClick={() =>
              setShowFilters((current) => !current)
            }
          >
            <Filter size={16} />
            Filter
          </button>

        </div>

        {/* =================================
            FILTER PANEL
        ================================= */}

        {showFilters && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              padding: "18px 20px",
              marginBottom: "18px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              flexWrap: "wrap",
            }}
          >

            {/* RISK FILTER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Risk:
              </label>

              <select
                value={riskFilter}
                onChange={(event) =>
                  setRiskFilter(event.target.value)
                }
                style={{
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Risks</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

            </div>

            {/* STATUS FILTER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Status:
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                style={{
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Status</option>
                <option value="Online">Online</option>
                <option value="Warning">Warning</option>
                <option value="Offline">Offline</option>
              </select>

            </div>

            {/* CLEAR */}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

        {/* =================================
            FILTER RESULT INFORMATION
        ================================= */}

        {hasActiveFilters && (
          <div
            style={{
              marginBottom: "14px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Showing{" "}
            <strong>
              {filteredAssets.length}
            </strong>{" "}
            of{" "}
            <strong>
              {assets.length}
            </strong>{" "}
            assets
          </div>
        )}

        {/* =================================
            TABLE
        ================================= */}

        <div className="incidents-table-wrapper">

          <table className="incidents-table">

            <thead>

              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Location</th>
                <th>Network</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Last Monitored</th>
              </tr>

            </thead>

            <tbody>

              {filteredAssets.map((asset) => (

                <tr key={asset.id}>

                  {/* ASSET */}

                  <td>

                    <div className="incident-name">

                      <strong>
                        {asset.id}
                      </strong>

                      <span>
                        {asset.name}
                      </span>

                    </div>

                  </td>

                  {/* TYPE */}

                  <td>
                    {asset.type}
                  </td>

                  {/* LOCATION */}

                  <td>
                    {asset.location}
                  </td>

                  {/* NETWORK */}

                  <td>
                    {asset.network}
                  </td>

                  {/* RISK */}

                  <td>

                    <span
                      className={`severity-badge ${riskClass(
                        asset.risk
                      )}`}
                    >
                      {asset.risk}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`status-badge ${statusClass(
                        asset.status
                      )}`}
                    >
                      {asset.status}
                    </span>

                  </td>

                  {/* LAST MONITORED */}

                  <td>
                    {asset.lastMonitored}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY STATE */}

          {filteredAssets.length === 0 && (

            <div className="empty-state">

              <Search size={22} />

              <div>
                <strong>
                  No assets found
                </strong>

                <span>
                  Try changing your search or filters.
                </span>
              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}