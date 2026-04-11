import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, LangSwitcher } from "../../context/LanguageContext";
import { getUser, removeToken, removeUser } from "../../utils/auth";
import api from "../../services/api";

const emptyForm = {
    user_id: "", employee_id: "", department: "",
    designation: "", office_location: "", is_active: true, joined_at: "",
};

const SERVICE_OPTIONS = [
    { value: "all",               label: "All Services" },
    { value: "birth_certificate", label: "Birth Certificate" },
];

export default function ReviewHandlerDashboard() {
    const navigate = useNavigate();
    const user     = getUser();
    const { t }    = useLanguage();
    const d = t("officerDashboard");
    const c = t("common");

    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading]                 = useState(true);
    const [activeFilter, setActiveFilter]       = useState("incoming");
    const [serviceDropdown, setServiceDropdown] = useState(false);
    const [selectedService, setSelectedService] = useState("all");
    const [searchQuery, setSearchQuery]         = useState("");
    const [showModal, setShowModal]             = useState(false);
    const [form, setForm]                       = useState(emptyForm);
    const [errors, setErrors]                   = useState({});
    const [successMsg, setSuccessMsg]           = useState("");
    const [showNotif, setShowNotif]             = useState(false);
    const [approveModal, setApproveModal]       = useState(null);
    const [approveSending, setApproveSending]   = useState(false);
    const [approveSuccess, setApproveSuccess]   = useState(false);

    const handleLogout = () => { removeToken(); removeUser(); navigate("/login"); };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const res = await api.get("/applications");
                const payload = res?.data ?? res;
                const raw =
                    Array.isArray(payload)               ? payload :
                    Array.isArray(payload?.data)         ? payload.data :
                    Array.isArray(payload?.applications) ? payload.applications : [];
                setAllApplications(raw.filter(app =>
                    app.status === "pending" || app.status === "processing"
                ));
            } catch (err) {
                console.error("Fetch error:", err);
                setAllApplications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const stats = {
        incoming:  allApplications.length,
        pending:   allApplications.filter(a => a.status === "pending").length,
        overdue:   0,
        completed: 0,
    };

    const getFilteredByTab = (apps) => {
        switch (activeFilter) {
            case "pending":   return apps.filter(a => a.status === "pending");
            case "overdue":   return [];
            case "completed": return apps.filter(a => a.status === "completed");
            default:          return apps; // incoming = all
        }
    };

    const filtered = getFilteredByTab(allApplications).filter(app => {
        const svc = app.service_type || "birth_certificate";
        const serviceMatch = selectedService === "all" || svc === selectedService;
        const q = searchQuery.toLowerCase();
        const searchMatch = !q ||
            (app.tracking_id   ?? "").toLowerCase().includes(q) ||
            (app.child_name_bn ?? "").toLowerCase().includes(q) ||
            (app.child_name_en ?? "").toLowerCase().includes(q);
        return serviceMatch && searchMatch;
    });

    const handleApproveConfirm = async () => {
        if (!approveModal) return;
        setApproveSending(true);
        try {
            await api.patch(`/applications/${approveModal.app_id}/status`, {
                status: "processing",
                remarks: "Review Handler কর্তৃক অনুমোদিত"
            });
            // list থেকে সরাও
            setAllApplications(prev => prev.filter(a => a.app_id !== approveModal.app_id));
            setApproveSuccess(true);
            setTimeout(() => { setApproveModal(null); setApproveSuccess(false); setApproveSending(false); }, 2500);
        } catch (err) {
            console.error("Approve error:", err);
            setApproveSending(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.user_id.toString().trim()) errs.user_id          = d.err_userId;
        if (!form.employee_id.trim())         errs.employee_id     = d.err_employeeId;
        if (!form.department.trim())          errs.department      = d.err_department;
        if (!form.designation.trim())         errs.designation     = d.err_designation;
        if (!form.office_location.trim())     errs.office_location = d.err_officeLocation;
        if (!form.joined_at)                  errs.joined_at       = d.err_joinedAt;
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        try {
            await api.post("/officers", {
                user_id: Number(form.user_id), employee_id: form.employee_id,
                department: form.department, designation: form.designation,
                office_location: form.office_location, is_active: form.is_active,
                joined_at: form.joined_at,
            });
        } catch (err) { console.error(err); }
        setSuccessMsg(d.regSuccess);
        setForm(emptyForm);
        setTimeout(() => { setSuccessMsg(""); setShowModal(false); }, 2200);
    };

    const closeModal = () => { setShowModal(false); setErrors({}); setForm(emptyForm); setSuccessMsg(""); };

    const getBadge = (status) => {
        const map = {
            pending:    { label: "Payment Pending", bg: "#fff3e0", color: "#c2410c", border: "#fed7aa" },
            processing: { label: "In Progress",     bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
            completed:  { label: "Completed",       bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
            approved:   { label: "Approved",        bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
            rejected:   { label: "Rejected",        bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
        };
        return map[status] ?? { label: status, bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
    };

    const statCards = [
        { key: "incoming",  label: d.incomingRequests,    value: stats.incoming,  color: "#111",    barColor: "#374151" },
        { key: "pending",   label: d.pendingVerification, value: stats.pending,   color: "#d4a017", barColor: "#f59e0b" },
        { key: "overdue",   label: d.overdueTask,         value: stats.overdue,   color: "#dc2626", barColor: "#ef4444" },
        { key: "completed", label: d.completed,           value: stats.completed, color: "#16a34a", barColor: "#22c55e" },
    ];

    const expectedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB");

    return (
        <div style={s.root}>

            {/* Navbar */}
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
                    <div style={{ position: "relative" }}>
                        <div style={{ cursor: "pointer" }} onClick={() => setShowNotif(v => !v)}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            <span style={s.bellDot}/>
                        </div>
                        {showNotif && (
                            <div style={{ position:"absolute",top:"140%",right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:999,minWidth:280,overflow:"hidden" }}>
                                <div style={{ padding:"12px 16px",borderBottom:"1px solid #f3f4f6",fontWeight:700,fontSize:14,color:"#111" }}>🔔 নোটিফিকেশন</div>
                                {allApplications.slice(0,5).length===0
                                    ? <div style={{ padding:"16px",fontSize:13,color:"#6b7280",textAlign:"center" }}>কোনো নতুন নোটিফিকেশন নেই</div>
                                    : allApplications.slice(0,5).map(app=>(
                                        <div key={app.app_id} style={{ padding:"10px 16px",borderBottom:"1px solid #f9fafb",fontSize:13 }}>
                                            <div style={{ fontWeight:600,color:"#111" }}>নতুন আবেদন: {app.child_name_en||app.child_name_bn||"Applicant"}</div>
                                            <div style={{ color:"#6b7280",fontSize:12,marginTop:2 }}>{app.tracking_id} • {app.status}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                    <div style={s.userRow}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span style={s.email}>{user?.email||user?.mobile||"Review Handler"}</span>
                    </div>
                    <button style={s.logoutBtn} onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:5 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        {c.logout}
                    </button>
                </div>
            </header>

            <main style={s.main}>

                {/* ✅ Stat Cards — Filter buttons */}
                <div style={s.cardRow}>
                    {statCards.map(card => (
                        <div
                            key={card.key}
                            onClick={() => setActiveFilter(card.key)}
                            style={{
                                ...s.card,
                                cursor: "pointer",
                                border: activeFilter===card.key ? `2px solid ${card.barColor}` : "2px solid transparent",
                                boxShadow: activeFilter===card.key ? `0 4px 16px ${card.barColor}30` : "none",
                                transform: activeFilter===card.key ? "translateY(-2px)" : "none",
                                transition: "all 0.18s ease",
                            }}
                        >
                            <div style={s.cardLabel}>{card.label}</div>
                            <div style={{ ...s.cardVal, color: card.color }}>{card.value}</div>
                            {activeFilter===card.key && (
                                <div style={{ height:3,background:card.barColor,borderRadius:2,marginTop:10 }}/>
                            )}
                        </div>
                    ))}
                </div>

                {/* Search + Filter + Register */}
                <div style={s.searchWrap}>
                    <div style={s.searchInner}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input style={s.searchInput} placeholder={d.searchPlaceholder} value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                    </div>
                    <div style={{ position:"relative" }}>
                        <button style={s.filterBtn} onClick={()=>setServiceDropdown(v=>!v)}>
                            {SERVICE_OPTIONS.find(o=>o.value===selectedService)?.label??"All Services"}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:8 }}>
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                        {serviceDropdown && (
                            <div style={s.dropdown}>
                                {SERVICE_OPTIONS.map(opt=>(
                                    <div key={opt.value} style={{ ...s.dropItem, background:selectedService===opt.value?"#f0fdf4":"white", color:selectedService===opt.value?"#15803d":"#333", fontWeight:selectedService===opt.value?700:500 }}
                                        onClick={()=>{ setSelectedService(opt.value); setServiceDropdown(false); }}>
                                        {opt.value!=="all"&&<span style={{ marginRight:8 }}>📄</span>}
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button style={s.regTriggerBtn} onClick={()=>setShowModal(true)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:6 }}>
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        {d.registerOfficer}
                    </button>
                </div>

                {/* Active filter badge */}
                {activeFilter!=="incoming" && (
                    <div style={{ marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ fontSize:13,color:"#6b7280" }}>Filter:</span>
                        <span style={{ background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0",borderRadius:20,padding:"3px 12px",fontSize:13,fontWeight:600 }}>
                            {statCards.find(c=>c.key===activeFilter)?.label}
                        </span>
                        <button onClick={()=>setActiveFilter("incoming")} style={{ background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:13 }}>
                            ✕ Clear
                        </button>
                    </div>
                )}

                {/* Table */}
                <div style={s.tableWrap}>
                    <div style={s.tHead}>
                        <span style={{ ...s.th,flex:2.4 }}>{d.colTitle}</span>
                        <span style={{ ...s.th,flex:1   }}>{d.colStatus}</span>
                        <span style={{ ...s.th,flex:1   }}>{d.colCitizen}</span>
                        <span style={{ ...s.th,flex:1.6 }}>{d.colTrackingId}</span>
                        <span style={{ ...s.th,flex:0.8 }}>{d.colDate}</span>
                        <span style={{ ...s.th,flex:2,justifyContent:"flex-end" }}></span>
                    </div>

                    {loading ? (
                        [1,2,3].map(i=>(
                            <div key={i} style={{ ...s.tRow,opacity:0.4 }}>
                                <span style={{ ...s.td,flex:2.4 }}><div style={{ height:14,background:"#e5e7eb",borderRadius:4,width:"70%" }}/></span>
                                <span style={{ ...s.td,flex:1   }}><div style={{ height:14,background:"#e5e7eb",borderRadius:4,width:"60%" }}/></span>
                                <span style={{ ...s.td,flex:1   }}><div style={{ height:14,background:"#e5e7eb",borderRadius:4,width:"50%" }}/></span>
                                <span style={{ ...s.td,flex:1.6 }}><div style={{ height:14,background:"#e5e7eb",borderRadius:4,width:"80%" }}/></span>
                                <span style={{ ...s.td,flex:0.8 }}><div style={{ height:14,background:"#e5e7eb",borderRadius:4,width:"60%" }}/></span>
                                <span style={{ ...s.td,flex:2 }}/>
                            </div>
                        ))
                    ) : filtered.length===0 ? (
                        [1,2,3].map(i=>(
                            <div key={i} style={{ ...s.tRow,minHeight:64 }}>
                                <span style={{ ...s.td,flex:2.4 }}/><span style={{ ...s.td,flex:1 }}/>
                                <span style={{ ...s.td,flex:1   }}/><span style={{ ...s.td,flex:1.6 }}/>
                                <span style={{ ...s.td,flex:0.8 }}/><span style={{ ...s.td,flex:2 }}/>
                            </div>
                        ))
                    ) : (
                        filtered.map(app=>{
                            const badge   = getBadge(app.status);
                            const dateStr = app.submitted_at||app.created_at
                                ? new Date(app.submitted_at||app.created_at).toLocaleDateString("en-GB") : "—";
                            const citizenName = app.child_name_en||app.child_name_bn||"—";
                            return (
                                <div key={app.app_id} style={s.tRow}>
                                    {/* ✅ Title সবসময় Birth Certificate Application */}
                                    <span style={{ ...s.td,flex:2.4,fontWeight:500,color:"#111" }}>
                                        Birth Certificate Application
                                    </span>
                                    <span style={{ ...s.td,flex:1 }}>
                                        <span style={{ background:badge.bg,color:badge.color,border:`1px solid ${badge.border}`,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700 }}>
                                            {badge.label}
                                        </span>
                                    </span>
                                    <span style={{ ...s.td,flex:1,color:"#333" }}>{citizenName}</span>
                                    <span style={{ ...s.td,flex:1.6,color:"#555",fontSize:13 }}>{app.tracking_id??"—"}</span>
                                    <span style={{ ...s.td,flex:0.8,color:"#666",fontSize:13 }}>{dateStr}</span>
                                    <span style={{ ...s.td,flex:2,gap:10,justifyContent:"flex-end" }}>
                                        {/* ✅ Review Request → review page navigate */}
                                        <button style={s.reviewBtn}
                                            onClick={()=>navigate(`/review-handler/review/${app.app_id}`,{state:{app}})}>
                                            {d.reviewRequest}
                                        </button>
                                        {/* ✅ Approve → modal */}
                                        <button style={s.approveBtn}
                                            onClick={()=>{ setApproveModal(app); setApproveSuccess(false); }}>
                                            {d.approve}
                                        </button>
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* ✅ Approve Modal — SMS preview + confirm */}
            {approveModal && (
                <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&!approveSending&&setApproveModal(null)}>
                    <div style={{ ...s.modal,maxWidth:480 }}>
                        {approveSuccess ? (
                            <div style={s.successBox}>
                                <div style={{ fontSize:48 }}>✅</div>
                                <p style={{ margin:"14px 0 4px",fontWeight:700,fontSize:17,color:"#15803d" }}>অনুমোদন সফল হয়েছে!</p>
                                <p style={{ fontSize:13,color:"#6b7280" }}>Citizen-এর ফোনে SMS পাঠানো হয়েছে</p>
                            </div>
                        ) : (
                            <>
                                <div style={s.modalHeader}>
                                    <span style={s.modalTitle}>📋 আবেদন অনুমোদন করুন</span>
                                    <button style={s.modalClose} onClick={()=>setApproveModal(null)}>✕</button>
                                </div>
                                <div style={{ padding:"20px 24px" }}>
                                    {/* Application info */}
                                    <div style={{ background:"#f9fafb",borderRadius:10,padding:"14px 16px",marginBottom:18 }}>
                                        <div style={{ fontSize:13,color:"#6b7280",marginBottom:6 }}>আবেদনের তথ্য</div>
                                        <div style={{ fontSize:14,fontWeight:600,color:"#111",marginBottom:4 }}>
                                            {approveModal.child_name_bn||approveModal.child_name_en||"Applicant"}
                                        </div>
                                        <div style={{ fontSize:13,color:"#555" }}>Tracking ID: <strong>{approveModal.tracking_id}</strong></div>
                                        <div style={{ fontSize:13,color:"#555",marginTop:4 }}>Service: <strong>Birth Certificate Application</strong></div>
                                    </div>

                                    {/* SMS preview */}
                                    <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"14px 16px",marginBottom:20 }}>
                                        <div style={{ fontSize:13,fontWeight:700,color:"#1d4ed8",marginBottom:8 }}>
                                            📱 Citizen-এর ফোনে যে SMS যাবে:
                                        </div>
                                        <div style={{ fontSize:13,color:"#374151",lineHeight:1.7,background:"white",padding:"10px 12px",borderRadius:8 }}>
                                            প্রিয় <strong>{approveModal.child_name_bn||approveModal.child_name_en||"আবেদনকারী"}</strong>,<br/>
                                            আপনার জন্ম নিবন্ধন আবেদন (<strong>{approveModal.tracking_id}</strong>) অনুমোদিত হয়েছে এবং এখন <strong>In Progress</strong> অবস্থায় আছে।<br/>
                                            প্রত্যাশিত সম্পন্নের তারিখ: <strong>{expectedDate}</strong>।<br/>
                                            — Smart Citizen Service Tracker
                                        </div>
                                    </div>

                                    <div style={{ display:"flex",justifyContent:"flex-end",gap:10 }}>
                                        <button style={s.cancelBtn} onClick={()=>setApproveModal(null)} disabled={approveSending}>বাতিল</button>
                                        <button style={{ ...s.submitBtn,opacity:approveSending?0.7:1 }}
                                            onClick={handleApproveConfirm} disabled={approveSending}>
                                            {approveSending?"পাঠানো হচ্ছে...":"✓ অনুমোদন করুন ও SMS পাঠান"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {showModal && (
                <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
                    <div style={s.modal}>
                        <div style={s.modalHeader}>
                            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                                <div style={{ width:32,height:32,background:"#dcfce7",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                                    </svg>
                                </div>
                                <span style={s.modalTitle}>{d.regTitle}</span>
                            </div>
                            <button style={s.modalClose} onClick={closeModal}>✕</button>
                        </div>
                        {successMsg?(
                            <div style={s.successBox}>
                                <div style={{ fontSize:40 }}>✅</div>
                                <p style={{ margin:"12px 0 0",fontWeight:700,fontSize:16,color:"#15803d" }}>{successMsg}</p>
                            </div>
                        ):(
                            <div style={s.modalBody}>
                                <Field label={d.regUserId} required error={errors.user_id}>
                                    <input name="user_id" value={form.user_id} onChange={handleChange} placeholder={d.ph_userId} type="number" min="1" style={{ ...s.input,...(errors.user_id?s.inputErr:{}) }}/>
                                </Field>
                                <Field label={d.regEmployeeId} required error={errors.employee_id}>
                                    <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder={d.ph_employeeId} style={{ ...s.input,...(errors.employee_id?s.inputErr:{}) }}/>
                                </Field>
                                <div style={s.twoCol}>
                                    <Field label={d.regDepartment} required error={errors.department}>
                                        <input name="department" value={form.department} onChange={handleChange} placeholder={d.ph_department} style={{ ...s.input,...(errors.department?s.inputErr:{}) }}/>
                                    </Field>
                                    <Field label={d.regDesignation} required error={errors.designation}>
                                        <input name="designation" value={form.designation} onChange={handleChange} placeholder={d.ph_designation} style={{ ...s.input,...(errors.designation?s.inputErr:{}) }}/>
                                    </Field>
                                </div>
                                <Field label={d.regOfficeLocation} required error={errors.office_location}>
                                    <input name="office_location" value={form.office_location} onChange={handleChange} placeholder={d.ph_officeLocation} style={{ ...s.input,...(errors.office_location?s.inputErr:{}) }}/>
                                </Field>
                                <Field label={d.regJoinedAt} required error={errors.joined_at}>
                                    <input name="joined_at" value={form.joined_at} onChange={handleChange} type="date" style={{ ...s.input,...(errors.joined_at?s.inputErr:{}) }}/>
                                </Field>
                                <div style={s.checkRow}>
                                    <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={handleChange} style={{ width:16,height:16,accentColor:"#15803d",cursor:"pointer" }}/>
                                    <label htmlFor="is_active" style={{ fontSize:14,color:"#374151",cursor:"pointer",fontWeight:500 }}>{d.regIsActive}</label>
                                </div>
                                <div style={s.modalFooter}>
                                    <button style={s.cancelBtn} onClick={closeModal}>{d.regCancel}</button>
                                    <button style={s.submitBtn} onClick={handleSubmit}>{d.regSubmit}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div style={{ marginBottom:14,flex:1 }}>
            <label style={{ display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:5 }}>
                {label}{required&&<span style={{ color:"#dc2626",marginLeft:2 }}>*</span>}
            </label>
            {children}
            {error&&<p style={{ margin:"4px 0 0",fontSize:12,color:"#dc2626" }}>{error}</p>}
        </div>
    );
}

const s = {
    root:{ minHeight:"100vh",background:"#eef0ee",fontFamily:"'Segoe UI','Inter',sans-serif" },
    navbar:{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",padding:"10px 32px",borderBottom:"1px solid #e5e7eb",boxShadow:"0 1px 3px rgba(0,0,0,0.06)" },
    navLeft:{ display:"flex",alignItems:"center",gap:12 },
    logoBox:{ width:38,height:38,background:"#15803d",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center" },
    logoLetter:{ color:"#fff",fontWeight:800,fontSize:20 },
    appName:{ fontWeight:700,fontSize:15,color:"#111",lineHeight:1.3 },
    appSub:{ fontSize:11,color:"#888" },
    navRight:{ display:"flex",alignItems:"center",gap:16 },
    bellDot:{ position:"absolute",top:0,right:0,width:7,height:7,background:"#ef4444",borderRadius:"50%",border:"1.5px solid #fff" },
    userRow:{ display:"flex",alignItems:"center",gap:6 },
    email:{ fontSize:13,color:"#333" },
    logoutBtn:{ display:"flex",alignItems:"center",background:"transparent",border:"1px solid #d1d5db",borderRadius:7,color:"#333",fontWeight:600,fontSize:13,cursor:"pointer",padding:"6px 14px" },
    main:{ maxWidth:1100,margin:"0 auto",padding:"30px 24px" },
    cardRow:{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:26 },
    card:{ background:"#dddedd",borderRadius:12,padding:"20px 22px",userSelect:"none" },
    cardLabel:{ fontSize:14,fontWeight:600,color:"#444",marginBottom:8 },
    cardVal:{ fontSize:38,fontWeight:800,lineHeight:1 },
    searchWrap:{ display:"flex",alignItems:"center",gap:12,background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:18,boxShadow:"0 1px 3px rgba(0,0,0,0.06)" },
    searchInner:{ flex:1,display:"flex",alignItems:"center",gap:8,border:"1.5px solid #bbf7d0",borderRadius:8,padding:"7px 12px" },
    searchInput:{ flex:1,border:"none",outline:"none",fontSize:13,color:"#444",background:"transparent" },
    filterBtn:{ display:"flex",alignItems:"center",border:"1.5px solid #15803d",borderRadius:10,padding:"8px 16px",background:"#fff",color:"#15803d",fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap" },
    dropdown:{ position:"absolute",top:"110%",right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.10)",zIndex:999,minWidth:200,overflow:"hidden" },
    dropItem:{ padding:"10px 18px",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center" },
    regTriggerBtn:{ display:"flex",alignItems:"center",background:"#15803d",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap" },
    tableWrap:{ background:"#fff",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",overflow:"hidden" },
    tHead:{ display:"flex",alignItems:"center",padding:"12px 24px",borderBottom:"1px solid #e5e7eb" },
    th:{ display:"flex",alignItems:"center",flex:1,fontSize:13,fontWeight:700,color:"#333" },
    tRow:{ display:"flex",alignItems:"center",padding:"14px 24px",borderBottom:"1px solid #f3f4f6" },
    td:{ display:"flex",alignItems:"center",flex:1,fontSize:14 },
    reviewBtn:{ background:"#15803d",color:"#fff",border:"none",borderRadius:20,padding:"7px 16px",fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap" },
    approveBtn:{ background:"#fff",color:"#15803d",border:"2px solid #15803d",borderRadius:20,padding:"6px 18px",fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap" },
    overlay:{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20 },
    modal:{ background:"#fff",borderRadius:16,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
    modalHeader:{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:"1px solid #e5e7eb" },
    modalTitle:{ fontWeight:700,fontSize:16,color:"#111" },
    modalClose:{ background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:"#888",lineHeight:1,padding:"2px 6px" },
    modalBody:{ padding:"20px 24px" },
    twoCol:{ display:"flex",gap:14 },
    modalFooter:{ display:"flex",justifyContent:"flex-end",gap:10,marginTop:20,paddingTop:16,borderTop:"1px solid #f3f4f6" },
    successBox:{ padding:"48px 24px",textAlign:"center" },
    input:{ width:"100%",border:"1.5px solid #d1d5db",borderRadius:8,padding:"9px 12px",fontSize:14,color:"#111",outline:"none",boxSizing:"border-box",background:"#fafafa" },
    inputErr:{ borderColor:"#dc2626",background:"#fef2f2" },
    checkRow:{ display:"flex",alignItems:"center",gap:8,marginBottom:4 },
    cancelBtn:{ background:"#f3f4f6",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,fontSize:14,cursor:"pointer",color:"#555" },
    submitBtn:{ background:"#15803d",border:"none",borderRadius:8,padding:"9px 24px",fontWeight:600,fontSize:14,cursor:"pointer",color:"#fff" },
};
