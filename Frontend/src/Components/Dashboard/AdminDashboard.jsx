import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, LangSwitcher } from "../../context/LanguageContext";
import { getUser, removeToken, removeUser } from "../../utils/auth";
import api from "../../services/api";

/* ─── Status badge styles ─── */
const badgeStyle = {
    pending:    { background: "#fef08a", color: "#713f12" },
    processing: { background: "#dbeafe", color: "#1e40af" },
    approved:   { background: "#dcfce7", color: "#15803d" },
    completed:  { background: "#f3f4f6", color: "#374151" },
    rejected:   { background: "#fee2e2", color: "#dc2626" },
    verified:   { background: "#dcfce7", color: "#15803d" },
};

/* ─── Service options — শুধু birth certificate ─── */
const SERVICE_OPTIONS = [
    { value: "all",               label: "All Services" },
    { value: "birth_certificate", label: "Birth Certificate" },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user     = getUser();

    const { t } = useLanguage();
    const d = t("adminDashboard");
    const c = t("common");

    const [applications, setApplications]       = useState([]);
    const [users, setUsers]                     = useState([]);
    const [officers, setOfficers]               = useState([]);
    const [loading, setLoading]                 = useState(true);
    const [serviceDropdown, setServiceDropdown] = useState(false);
    const [selectedService, setSelectedService] = useState("all");
    const [searchQuery, setSearchQuery]         = useState("");

    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate("/login");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [appRes, userRes, officerRes] = await Promise.all([
                    api.get("/applications"),
                    api.get("/users"),
                    api.get("/officers"),
                ]);

                const getArr = (res) => {
                    const p = res?.data ?? res;
                    return Array.isArray(p) ? p :
                           Array.isArray(p?.data) ? p.data :
                           Array.isArray(p?.applications) ? p.applications :
                           Array.isArray(p?.users) ? p.users :
                           Array.isArray(p?.officers) ? p.officers : [];
                };

                setApplications(getArr(appRes));
                setUsers(getArr(userRes));
                setOfficers(getArr(officerRes));
            } catch (err) {
                console.error("Admin fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = applications.filter(app => {
        const serviceMatch =
            selectedService === "all" ||
            app.service_type === selectedService;

        const q = searchQuery.toLowerCase();
        const searchMatch = !q ||
            (app.tracking_id   ?? "").toLowerCase().includes(q) ||
            (app.child_name_bn ?? "").toLowerCase().includes(q) ||
            (app.child_name_en ?? "").toLowerCase().includes(q);

        return serviceMatch && searchMatch;
    });

    // Stat values from real API data
    const stats = {
        totalUsers:        users.length,
        activeCategories:  1,
        officers:          officers.length,
        totalRequest:      applications.length,
    };

    // Status key → translation key mapping
    const getStatusKey = (status) => {
        const map = {
            pending:    "statusPaymentPending",
            processing: "statusProcessing",
            approved:   "statusApproved",
            completed:  "statusCompleted",
            rejected:   "statusRejected",
            verified:   "statusApproved",
        };
        return map[status] ?? "statusProcessing";
    };

    return (
        <div style={s.root}>

            {/* ══ Navbar ══ */}
            <header style={s.navbar}>
                <div style={s.navLeft}>
                    <div style={s.logoBox}><span style={s.logoLetter}>P</span></div>
                    <div>
                        <div style={s.appName}>{d.appTitle}</div>
                        <div style={s.appSub}>{d.appSub}</div>
                    </div>
                </div>

                <div style={s.navRight}>
                    <LangSwitcher />

                    {/* ✅ FIX 3: Bell — notification icon clickable */}
                    <div style={{ position: "relative", cursor: "pointer" }}
                        onClick={() => alert("কোনো নতুন নোটিফিকেশন নেই")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span style={s.bellDot} />
                    </div>

                    {/* User */}
                    <div style={s.userRow}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span style={s.email}>{user?.email || user?.mobile || "Admin"}</span>
                    </div>

                    {/* ✅ FIX 1: Logout button */}
                    <button style={s.logoutBtn} onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ marginRight: 5 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {c.logout}
                    </button>
                </div>
            </header>

            {/* ══ Main ══ */}
            <main style={s.main}>

                {/* Stat Cards — real data */}
                <div style={s.cardRow}>
                    <StatCard label={d.totalUsers}        value={loading ? "..." : stats.totalUsers} />
                    <StatCard label={d.activeCategories}  value={loading ? "..." : stats.activeCategories} />
                    <StatCard label={d.departmentOfficer} value={loading ? "..." : stats.officers} />
                    <StatCard label={d.totalRequest}      value={loading ? "..." : stats.totalRequest} />
                </div>

                {/* Search + Filter */}
                <div style={s.searchWrap}>
                    <div style={s.searchInner}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            style={s.searchInput}
                            placeholder={d.searchPlaceholder}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* ✅ FIX 2: Service Type Dropdown */}
                    <div style={{ position: "relative" }}>
                        <button style={s.filterBtn} onClick={() => setServiceDropdown(v => !v)}>
                            {SERVICE_OPTIONS.find(o => o.value === selectedService)?.label ?? "All Services"}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginLeft: 8 }}>
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        {serviceDropdown && (
                            <div style={s.dropdown}>
                                {SERVICE_OPTIONS.map(opt => (
                                    <div
                                        key={opt.value}
                                        style={{
                                            ...s.dropItem,
                                            background: selectedService === opt.value ? "#f0fdf4" : "white",
                                            color: selectedService === opt.value ? "#15803d" : "#333",
                                            fontWeight: selectedService === opt.value ? 700 : 500,
                                        }}
                                        onClick={() => {
                                            setSelectedService(opt.value);
                                            setServiceDropdown(false);
                                        }}
                                    >
                                        {opt.value !== "all" && <span style={{ marginRight: 8 }}>📄</span>}
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activities Table */}
                <div style={s.tableWrap}>
                    <div style={s.tableTitle}>
                        {d.recentActivities}
                        {selectedService !== "all" && (
                            <span style={{
                                marginLeft: 10, fontSize: 12, fontWeight: 500,
                                color: "#15803d", background: "#f0fdf4",
                                border: "1px solid #bbf7d0", borderRadius: 6,
                                padding: "2px 10px",
                            }}>
                                {SERVICE_OPTIONS.find(o => o.value === selectedService)?.label}
                            </span>
                        )}
                    </div>

                    {/* Header */}
                    <div style={s.tHead}>
                        <span style={{ ...s.th, flex: 2.5 }}>{d.colActivity}</span>
                        <span style={{ ...s.th, flex: 1.5, borderLeft: "1px solid #e5e7eb", paddingLeft: 20 }}>
                            {d.colTimestamp}
                        </span>
                        <span style={{ ...s.th, flex: 1.5, borderLeft: "1px solid #e5e7eb", paddingLeft: 20 }}>
                            {d.colStatus}
                        </span>
                    </div>

                    {/* Rows */}
                    {loading ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                            লোড হচ্ছে...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                            {selectedService !== "all"
                                ? `"${SERVICE_OPTIONS.find(o => o.value === selectedService)?.label}" এর কোনো আবেদন নেই`
                                : "কোনো আবেদন পাওয়া যায়নি"}
                        </div>
                    ) : (
                        filtered.map(app => {
                            const statusKey = getStatusKey(app.status);
                            const style     = badgeStyle[app.status] ?? badgeStyle.processing;
                            const dateStr   = app.submitted_at || app.created_at
                                ? new Date(app.submitted_at || app.created_at)
                                    .toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                                : "—";
                            const activityLabel =
                                (app.child_name_en || app.child_name_bn || "Applicant") +
                                " - " +
                                (app.service_type === "birth_certificate"
                                    ? "Birth Certificate Application"
                                    : app.service_type ?? "Application");

                            return (
                                <div key={app.app_id} style={s.tRow}>
                                    <span style={{ ...s.td, flex: 2.5 }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: "#111", fontSize: 14 }}>
                                                {activityLabel}
                                            </div>
                                            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                                ({app.tracking_id ?? "—"})
                                            </div>
                                        </div>
                                    </span>
                                    <span style={{ ...s.td, flex: 1.5, borderLeft: "1px solid #e5e7eb", paddingLeft: 20, color: "#555", fontSize: 14 }}>
                                        {dateStr}
                                    </span>
                                    <span style={{ ...s.td, flex: 1.5, borderLeft: "1px solid #e5e7eb", paddingLeft: 20 }}>
                                        <span style={{ ...s.badge, ...style }}>
                                            {d[statusKey]}
                                        </span>
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

            </main>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div style={s.card}>
            <div style={s.cardLabel}>{label}</div>
            <div style={s.cardVal}>{value}</div>
        </div>
    );
}

const s = {
    root: { minHeight: "100vh", background: "#eef0ee", fontFamily: "'Segoe UI', 'Inter', sans-serif" },
    navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "10px 32px", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    navLeft: { display: "flex", alignItems: "center", gap: 12 },
    logoBox: { width: 38, height: 38, background: "#15803d", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" },
    logoLetter: { color: "#fff", fontWeight: 800, fontSize: 20 },
    appName: { fontWeight: 700, fontSize: 15, color: "#111", lineHeight: 1.3 },
    appSub: { fontSize: 11, color: "#888" },
    navRight: { display: "flex", alignItems: "center", gap: 16 },
    bellDot: { position: "absolute", top: 0, right: 0, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "1.5px solid #fff" },
    userRow: { display: "flex", alignItems: "center", gap: 6 },
    email: { fontSize: 13, color: "#333" },
    logoutBtn: { display: "flex", alignItems: "center", background: "transparent", border: "1px solid #d1d5db", borderRadius: 7, color: "#333", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "6px 14px" },
    main: { maxWidth: 1100, margin: "0 auto", padding: "30px 24px" },
    cardRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 26 },
    card: { background: "#dddedd", borderRadius: 12, padding: "20px 22px" },
    cardLabel: { fontSize: 14, fontWeight: 600, color: "#444", marginBottom: 8, lineHeight: 1.4 },
    cardVal: { fontSize: 38, fontWeight: 800, color: "#111", lineHeight: 1 },
    searchWrap: { display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    searchInner: { flex: 1, display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #bbf7d0", borderRadius: 8, padding: "7px 12px" },
    searchInput: { flex: 1, border: "none", outline: "none", fontSize: 13, color: "#444", background: "transparent" },
    filterBtn: { display: "flex", alignItems: "center", border: "1.5px solid #15803d", borderRadius: 10, padding: "8px 16px", background: "#fff", color: "#15803d", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
    dropdown: { position: "absolute", top: "110%", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 999, minWidth: 200, overflow: "hidden" },
    dropItem: { padding: "10px 18px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center" },
    tableWrap: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" },
    tableTitle: { padding: "16px 24px 0", fontWeight: 700, fontSize: 15, color: "#111", display: "flex", alignItems: "center" },
    tHead: { display: "flex", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #e5e7eb", marginTop: 10 },
    th: { display: "flex", alignItems: "center", flex: 1, fontSize: 13, fontWeight: 700, color: "#333" },
    tRow: { display: "flex", alignItems: "stretch", borderBottom: "1px solid #e5e7eb", minHeight: 72 },
    td: { display: "flex", alignItems: "center", flex: 1, fontSize: 14, padding: "14px 24px" },
    badge: { display: "inline-block", padding: "4px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600 },
};
