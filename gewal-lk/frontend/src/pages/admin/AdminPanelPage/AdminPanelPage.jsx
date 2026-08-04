import { useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Flag,
  Home,
  Image,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings,
  ShieldAlert,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import { demoProperties } from "../../../data/demoProperties.js";
import "./AdminPanelPage.css";

const tabs = [
  ["dashboard", LayoutDashboard, "Dashboard"],
  ["users", UsersRound, "Users"],
  ["agents", BadgeCheck, "Agents"],
  ["agencies", Building2, "Agencies"],
  ["properties", Home, "Properties"],
  ["approval", CheckCircle2, "Approvals"],
  ["featured", Star, "Featured"],
  ["appointments", Activity, "Appointments"],
  ["reviews", FileText, "Reviews"],
  ["reports", Flag, "Reports"],
  ["amenities", Settings, "Amenities"],
  ["ads", Megaphone, "Advertisements"],
  ["payments", CreditCard, "Payments"],
  ["blog", FileText, "Blog"],
  ["notifications", Bell, "Notifications"],
  ["analytics", BarChart3, "Analytics"],
  ["logs", ShieldAlert, "Audit Logs"],
];

const usersSeed = [
  { id: 1, name: "Sarah Fernando", email: "sarah@example.com", role: "buyer", status: "active" },
  { id: 2, name: "Danial Doe", email: "danial@example.com", role: "agent", status: "active" },
  { id: 3, name: "Nimali Perera", email: "nimali@example.com", role: "seller", status: "pending" },
];

const reportsSeed = [
  { id: 1, property: "Skyline Apartment", reason: "Wrong Price", status: "Pending" },
  { id: 2, property: "Residential Land", reason: "Duplicate", status: "Pending" },
];

function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState(usersSeed);
  const [properties, setProperties] = useState(demoProperties.map((item, index) => ({ ...item, approval: index % 2 ? "Pending" : "Approved" })));
  const [reports, setReports] = useState(reportsSeed);
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(
    () => users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase())),
    [query, users]
  );

  const approveProperty = (id) => {
    setProperties((current) => current.map((item) => item.id === id ? { ...item, approval: "Approved" } : item));
  };

  const rejectProperty = (id) => {
    setProperties((current) => current.map((item) => item.id === id ? { ...item, approval: "Rejected" } : item));
  };

  return (
    <main className="admin-page">
      <section className="container admin-hero">
        <div>
          <span>Admin Control Center</span>
          <h1>Manage Gewal.lk operations</h1>
          <p>Control users, agents, listings, approvals, reports, payments, content, advertisements and analytics.</p>
        </div>
      </section>

      <section className="container admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand-card">
            <ShieldAlert size={28} />
            <h3>Super Admin</h3>
            <p>Full platform access</p>
          </div>
          <nav>
            {tabs.map(([key, Icon, label]) => (
              <button key={key} className={activeTab === key ? "is-active" : ""} onClick={() => setActiveTab(key)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="admin-content">
          {activeTab === "dashboard" && <DashboardPanel />}

          {activeTab === "users" && (
            <Panel title="Users" description="Search, suspend, activate and manage platform users.">
              <SearchBox query={query} setQuery={setQuery} />
              <DataTable columns={["Name", "Email", "Role", "Status", "Actions"]}>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><Status status={user.status} /></td>
                    <td><button onClick={() => setUsers((current) => current.filter((item) => item.id !== user.id))}><Trash2 size={15} /> Delete</button></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeTab === "properties" && <PropertiesPanel properties={properties} />}

          {activeTab === "approval" && (
            <Panel title="Property Approval" description="Approve or reject submitted listings.">
              <DataTable columns={["Property", "Type", "Price", "Status", "Actions"]}>
                {properties.filter((item) => item.approval === "Pending").map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td><td>{item.propertyType}</td><td>{item.price}</td><td><Status status={item.approval} /></td>
                    <td><button onClick={() => approveProperty(item.id)}><CheckCircle2 size={15} /> Approve</button><button onClick={() => rejectProperty(item.id)}><XCircle size={15} /> Reject</button></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {activeTab === "reports" && (
            <Panel title="Reports" description="Review user-submitted property reports.">
              <DataTable columns={["Property", "Reason", "Status", "Actions"]}>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.property}</td><td>{report.reason}</td><td><Status status={report.status} /></td>
                    <td><button onClick={() => setReports((current) => current.filter((item) => item.id !== report.id))}>Resolve</button></td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          )}

          {!["dashboard", "users", "properties", "approval", "reports"].includes(activeTab) && (
            <GenericAdminPanel tab={activeTab} />
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardPanel() {
  const stats = [["Users", "12.4k", UsersRound], ["Properties", "4.8k", Home], ["Revenue", "Rs. 2.1M", CreditCard], ["Reports", "18", Flag]];
  return <Panel title="Dashboard" description="Realtime overview of marketplace health."><div className="admin-stats">{stats.map(([label, value, Icon]) => <article key={label}><Icon size={24} /><strong>{value}</strong><span>{label}</span></article>)}</div><div className="admin-chart"><BarChart3 size={34} /><h3>Monthly platform activity</h3><div><i style={{height:"45%"}}/><i style={{height:"68%"}}/><i style={{height:"54%"}}/><i style={{height:"86%"}}/><i style={{height:"72%"}}/><i style={{height:"92%"}}/></div></div></Panel>;
}

function PropertiesPanel({ properties }) {
  return <Panel title="Properties" description="View and moderate all property listings."><DataTable columns={["Image", "Title", "Type", "Price", "Approval", "Views"]}>{properties.map((item) => <tr key={item.id}><td><img src={item.image} alt="" className="admin-thumb" /></td><td>{item.title}</td><td>{item.propertyType}</td><td>{item.price}</td><td><Status status={item.approval} /></td><td><Eye size={15} /> 1.2k</td></tr>)}</DataTable></Panel>;
}

function GenericAdminPanel({ tab }) {
  const title = tab.replace(/-/g, " ").replace(/^./, (char) => char.toUpperCase());
  return <Panel title={title} description="Management tools for this module."><div className="admin-module-grid"><article><Image size={24} /><h3>Create</h3><p>Add a new record.</p><button>Add New</button></article><article><Search size={24} /><h3>Search</h3><p>Find and filter records.</p><button>Search</button></article><article><Settings size={24} /><h3>Settings</h3><p>Configure module options.</p><button>Configure</button></article></div></Panel>;
}

function SearchBox({ query, setQuery }) {
  return <label className="admin-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" /></label>;
}

function DataTable({ columns, children }) {
  return <div className="admin-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Status({ status }) {
  return <span className={`admin-status admin-status--${status.toLowerCase()}`}>{status}</span>;
}

function Panel({ title, description, children }) {
  return <section className="admin-panel"><div className="admin-panel__heading"><h2>{title}</h2><p>{description}</p></div>{children}</section>;
}

export default AdminPanelPage;
