import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage, LangSwitcher } from "../../context/LanguageContext";
import { getUser, removeToken, removeUser } from "../../utils/auth";
import api from "../../services/api";

// Local translations
const T = {
    bn: {
        title:        'Birth Certificate Application',
        backBtn:      '← Dashboard-এ ফিরুন',
        appInfo:      'আবেদনের তথ্য',
        docSection:   '📎 সংযুক্ত নথিপত্র — যাচাই করুন',
        docHint:      'প্রতিটি নথি দেখুন এবং সঠিক হলে চেক করুন। সব নথি যাচাইয়ের পরেই Approve করা যাবে।',
        viewBtn:      '👁 দেখুন',
        verified:     '✓ যাচাই হয়েছে',
        verifyCheck:  'যাচাই করুন',
        noDoc:        '⚠️ এই আবেদনের সাথে কোনো নথিপত্র সংযুক্ত নেই।',
        verifyCount:  (v, t) => `${v}/${t} যাচাই হয়েছে`,
        allVerified:  '✓ সব নথি যাচাই সম্পন্ন!',
        cancelBtn:    'বাতিল করুন',
        approveBtn:   '✓ অনুমোদন করুন',
        approving:    'অনুমোদন হচ্ছে...',
        alreadyDone:  '✓ ইতিমধ্যে অনুমোদিত',
        warnVerify:   '⚠️ সব নথি যাচাই করুন',
        loading:      'লোড হচ্ছে...',
        docLoading:   'নথিপত্র লোড হচ্ছে...',
        notFound:     'আবেদন পাওয়া যায়নি।',
        doneTitle:    'আবেদন অনুমোদিত হয়েছে!',
        doneSub:      'Dashboard-এ ফিরছেন...',
        // Info labels
        nameBn:       'আবেদনকারীর নাম (বাংলা)',
        nameEn:       'আবেদনকারীর নাম (ইংরেজি)',
        dob:          'জন্ম তারিখ',
        gender:       'লিঙ্গ',
        birthPlace:   'জন্মস্থান',
        fatherName:   'পিতার নাম',
        fatherNationality: 'পিতার জাতীয়তা',
        motherName:   'মাতার নাম',
        motherNationality: 'মাতার জাতীয়তা',
        address:      'স্থায়ী ঠিকানা',
        fee:          'সেবা ফি',
        submitDate:   'আবেদনের তারিখ',
        // Doc labels 
        hospital_certificate: 'হাসপাতাল সনদ',

        birth_certificate:    'জন্ম নিবন্ধন সনদ',
        passport_photo:       'পাসপোর্ট ছবি',
       
        closeModal:   '✕ বন্ধ করুন',
    },
    en: {
        title:        'Birth Certificate Application',
        backBtn:      '← Back to Dashboard',
        appInfo:      'Application Information',
        docSection:   '📎 Attached Documents — Verify',
        docHint:      'View each document and check if correct. Approve only after all documents are verified.',
        viewBtn:      '👁 View',
        verified:     '✓ Verified',
        verifyCheck:  'Verify',
        noDoc:        '⚠️ No documents attached with this application.',
        verifyCount:  (v, t) => `${v}/${t} verified`,
        allVerified:  '✓ All documents verified!',
        cancelBtn:    'Cancel',
        approveBtn:   '✓ Approve',
        approving:    'Approving...',
        alreadyDone:  '✓ Already Approved',
        warnVerify:   '⚠️ Verify all documents',
        loading:      'Loading...',
        docLoading:   'Loading documents...',
        notFound:     'Application not found.',
        doneTitle:    'Application Approved!',
        doneSub:      'Returning to Dashboard...',
        nameBn:       'Applicant Name (Bangla)',
        nameEn:       'Applicant Name (English)',
        dob:          'Date of Birth',
        gender:       'Gender',
        birthPlace:   'Place of Birth',
        fatherName:   "Father's Name",
        fatherNationality: "Father's Nationality",
        motherName:   "Mother's Name",
        motherNationality: "Mother's Nationality",
        address:      'Permanent Address',
        fee:          'Service Fee',
        submitDate:   'Application Date',
        hospital_certificate: 'Hospital Certificate',

        birth_certificate:    'Birth Certificate',
        passport_photo:       'Passport Photo',
        closeModal:   '✕ Close',
    },
};

export default function ReviewRequestPage() {
    const navigate  = useNavigate();
    const { id }    = useParams();
    const location  = useLocation();
    const { lang }  = useLanguage();
    const tt        = T[lang];
    const user      = getUser();

    const [app, setApp]               = useState(location.state?.app || null);
    const [documents, setDocuments]   = useState([]);
    const [loading, setLoading]       = useState(!location.state?.app);
    const [docLoading, setDocLoading] = useState(true);
    const [approving, setApproving]   = useState(false);
    const [done, setDone]             = useState(false);
    const [verifiedDocs, setVerifiedDocs] = useState({});

    const [docModal, setDocModal]     = useState(null); 

    const handleLogout = () => { removeToken(); removeUser(); navigate("/login"); };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await api.get(`/applications/${id}`);
                const payload = res?.data ?? res;
                const appData = payload?.data ?? payload;
                if (!app) { setApp(appData); setLoading(false); }
                setDocuments(Array.isArray(appData?.documents) ? appData.documents : []);
            } catch (err) {
                console.error(err);
                setLoading(false);
            } finally {
                setDocLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const allVerified = documents.length === 0 || documents.every(d => verifiedDocs[d.doc_id]);
    const verifiedCount = Object.values(verifiedDocs).filter(Boolean).length;

    const handleApprove = async () => {
        setApproving(true);
        try {
            await api.patch(`/applications/${app.app_id}/status`, {
                status: "processing",
                remarks: "Review Handler কর্তৃক নথিপত্র যাচাই ও অনুমোদিত"
            });
            setDone(true);
            setTimeout(() => navigate("/review-handler/dashboard"), 2800);
        } catch (err) {
            console.error(err);
            setApproving(false);
        }
    };

    //  Open document in popup modal
    const handleViewDoc = (doc) => {
        const url = `http://localhost:5000${doc.file_path}`;
        setDocModal({ url, name: doc.file_name, type: doc.mime_type });
    };

    const getBadge = (status) => {
        const map = {
            pending:    { label: "Payment Pending", bg: "#fff3e0", color: "#c2410c", border: "#fed7aa" },
            processing: { label: "In Progress",     bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
            completed:  { label: "Completed",       bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
            rejected:   { label: "Rejected",        bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
        };
        return map[status] ?? { label: status, bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
    };

    return (
        <div style={s.root}>

            {/* Navbar */}
            <header style={s.navbar}>
                <div style={s.navLeft}>
                    <div style={s.logoBox}><span style={s.logoLetter}>P</span></div>
                    <div>
                        <div style={s.appName}>Smart Citizen Service Tracker</div>
                        <div style={s.appSub}>Bangladesh Digital Services</div>
                    </div>
                </div>
                <div style={s.navRight}>
                    <LangSwitcher />
                    <div style={s.userRow}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span style={s.email}>{user?.email || user?.mobile}</span>
                    </div>
                    <button style={s.logoutBtn} onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            <main style={s.main}>
                <button style={s.backBtn} onClick={() => navigate("/review-handler/dashboard")}>
                    {tt.backBtn}
                </button>

                {loading ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>{tt.loading}</div>
                ) : done ? (
                    <div style={{ textAlign: "center", padding: 60 }}>
                        <div style={{ fontSize: 56 }}>✅</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#15803d", marginTop: 16 }}>{tt.doneTitle}</div>
                        <div style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>{tt.doneSub}</div>
                    </div>
                ) : app ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* ── Application Info ── */}
                        <div style={s.card}>
                            <div style={s.cardHeader}>
                                <div>
                                    <h2 style={s.cardTitle}>{tt.title}</h2>
                                    <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "monospace", marginTop: 4 }}>{app.tracking_id}</div>
                                </div>
                                {app.status && (() => {
                                    const badge = getBadge(app.status);
                                    return <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>{badge.label}</span>;
                                })()}
                            </div>

                            <div style={s.sectionLabel}>{tt.appInfo}</div>
                            <div style={s.grid}>
                                <InfoRow label={tt.nameBn}     value={app.child_name_bn} />
                                <InfoRow label={tt.nameEn}     value={app.child_name_en} />
                                <InfoRow label={tt.dob}        value={app.birth_date ? new Date(app.birth_date).toLocaleDateString("en-GB") : null} />
                                <InfoRow label={tt.gender}     value={app.gender} />
                                <InfoRow label={tt.birthPlace} value={app.birth_place} />
                                <InfoRow label={tt.fatherName} value={app.father_name_bn || app.father_name_en} />
                                <InfoRow label={tt.fatherNationality} value={app.father_nationality} />
                                <InfoRow label={tt.motherName} value={app.mother_name_bn || app.mother_name_en} />
                                <InfoRow label={tt.motherNationality} value={app.mother_nationality} />
                                <InfoRow label={tt.address}    value={app.permanent_address} />
                                <InfoRow label={tt.fee}        value={app.fee_amount ? `৳${app.fee_amount}` : null} />
                                <InfoRow label={tt.submitDate} value={app.submitted_at || app.created_at ? new Date(app.submitted_at || app.created_at).toLocaleDateString("en-GB") : null} />
                            </div>
                        </div>

                        {/* ── Documents ── */}
                        <div style={s.card}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <div style={s.sectionTitle}>{tt.docSection}</div>
                                {documents.length > 0 && (
                                    <div style={{ fontSize: 13, color: allVerified ? "#15803d" : "#6b7280", fontWeight: 600 }}>
                                        {tt.verifyCount(verifiedCount, documents.length)}
                                        {allVerified && ` ${tt.allVerified}`}
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{tt.docHint}</div>

                            {docLoading ? (
                                <div style={{ color: "#6b7280", fontSize: 14 }}>{tt.docLoading}</div>
                            ) : documents.length === 0 ? (
                                <div style={{ background: "#fef9ef", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#92400e" }}>
                                    {tt.noDoc}
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {documents.map(doc => (
                                        <div key={doc.doc_id} style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            background: verifiedDocs[doc.doc_id] ? "#f0fdf4" : "#f9fafb",
                                            border: `1.5px solid ${verifiedDocs[doc.doc_id] ? "#bbf7d0" : "#e5e7eb"}`,
                                            borderRadius: 10, padding: "12px 16px", transition: "all 0.18s",
                                        }}>
                                            {/* Icon */}
                                            <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e7eb", flexShrink: 0 }}>
                                                {doc.mime_type?.includes("pdf") ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round"/>
                                                        <polyline points="14 2 14 8 20 8"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                        <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                                                    {tt[doc.doc_type] ?? doc.doc_type}
                                                </div>
                                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{doc.file_name}</div>
                                            </div>

                                          
                                            <button
                                                onClick={() => handleViewDoc(doc)}
                                                style={{ padding: "7px 14px", background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}
                                            >
                                                {tt.viewBtn}
                                            </button>

                                            {/* Verify checkbox */}
                                            <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", whiteSpace: "nowrap" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!verifiedDocs[doc.doc_id]}
                                                    onChange={e => setVerifiedDocs(prev => ({ ...prev, [doc.doc_id]: e.target.checked }))}
                                                    style={{ width: 17, height: 17, accentColor: "#15803d", cursor: "pointer" }}
                                                />
                                                <span style={{ fontSize: 13, fontWeight: 600, color: verifiedDocs[doc.doc_id] ? "#15803d" : "#6b7280" }}>
                                                    {verifiedDocs[doc.doc_id] ? tt.verified : tt.verifyCheck}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        
                        <div style={s.card}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button style={s.cancelBtn} onClick={() => navigate("/review-handler/dashboard")}>
                                    {tt.cancelBtn}
                                </button>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {documents.length > 0 && !allVerified && (
                                        <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>{tt.warnVerify}</span>
                                    )}
                                    <button
                                        style={{ ...s.approveBtn, opacity: (approving || !allVerified || app.status === "processing") ? 0.5 : 1, cursor: !allVerified ? "not-allowed" : "pointer" }}
                                        onClick={handleApprove}
                                        disabled={approving || !allVerified || app.status === "processing"}
                                    >
                                        {approving ? tt.approving : app.status === "processing" ? tt.alreadyDone : tt.approveBtn}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>{tt.notFound}</div>
                )}
            </main>

           
            {docModal && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={e => e.target === e.currentTarget && setDocModal(null)}
                >
                    <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 860, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>

                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{docModal.name}</div>
                            <button
                                onClick={() => setDocModal(null)}
                                style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#374151" }}
                            >
                                {tt.closeModal}
                            </button>
                        </div>

                        {/* Document viewer */}
                        <div style={{ flex: 1, overflow: "auto", background: "#f4f6f4", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                            {docModal.type?.includes("pdf") ? (
                                <iframe
                                    src={docModal.url}
                                    title={docModal.name}
                                    style={{ width: "100%", height: "70vh", border: "none" }}
                                />
                            ) : (
                                <img
                                    src={docModal.url}
                                    alt={docModal.name}
                                    style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }}
                                    onError={e => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                    }}
                                />
                            )}
                            <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: 12, color: "#6b7280", padding: 40 }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                </svg>
                                <div style={{ fontSize: 14 }}>ফাইল লোড করা যাচ্ছে না</div>
                                <a href={docModal.url} target="_blank" rel="noopener noreferrer" style={{ color: "#15803d", fontSize: 13, fontWeight: 600 }}>
                                    নতুন tab-এ খুলুন ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{ padding: "11px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{value || "—"}</div>
        </div>
    );
}

const s = {
    root: { minHeight: "100vh", background: "#f4f6f4", fontFamily: "'Segoe UI','Inter',sans-serif" },
    navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "10px 32px", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    navLeft: { display: "flex", alignItems: "center", gap: 12 },
    logoBox: { width: 38, height: 38, background: "#15803d", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" },
    logoLetter: { color: "#fff", fontWeight: 800, fontSize: 20 },
    appName: { fontWeight: 700, fontSize: 15, color: "#111" },
    appSub: { fontSize: 11, color: "#888" },
    navRight: { display: "flex", alignItems: "center", gap: 16 },
    userRow: { display: "flex", alignItems: "center", gap: 6 },
    email: { fontSize: 13, color: "#333" },
    logoutBtn: { display: "flex", alignItems: "center", background: "transparent", border: "1px solid #d1d5db", borderRadius: 7, color: "#333", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "6px 14px" },
    main: { maxWidth: 820, margin: "0 auto", padding: "28px 24px" },
    backBtn: { background: "none", border: "none", color: "#15803d", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 20, padding: 0 },
    card: { background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e5e7eb" },
    cardTitle: { fontSize: 20, fontWeight: 800, color: "#111", margin: 0 },
    sectionLabel: { fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: "#111" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" },
    cancelBtn: { background: "#f3f4f6", border: "none", borderRadius: 8, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#555" },
    approveBtn: { background: "#15803d", border: "none", borderRadius: 8, padding: "11px 26px", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#fff" },
};
