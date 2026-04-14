import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/* ─────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────── */
const STATUS_STEPS = [
    {
        key:   'submitted',
        label: 'Application Submitted',
        desc:  'Your application has been received and is awaiting payment.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        key:   'pending',
        label: 'Payment Pending',
        desc:  'Please complete the payment to proceed with your application.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
    },
    {
        key:   'processing',
        label: 'In Progress',
        desc:  'Payment received. Your application is being reviewed by the authority.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        key:   'verified',
        label: 'Verified',
        desc:  'Your documents have been verified by the officer.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        key:   'completed',
        label: 'Completed',
        desc:  'Your birth certificate is ready. You can now download it.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

// Which step index is "active" for a given status
const getStepIndex = (status) => {
    if (status === 'pending')    return 1;
    if (status === 'processing') return 2;
    if (status === 'verified')   return 3;
    if (status === 'approved')   return 3;
    if (status === 'completed')  return 4;
    if (status === 'rejected')   return -1;
    return 1; // default pending
};

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
const PageHeader = ({ onDashboard, onLogout, user, lang, setLang, c }) => (
    <header style={{
        background: 'white', borderBottom: '1px solid #e5e7eb',
        padding: '8px clamp(12px,3vw,28px)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, minHeight: 68,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                    <path d="M12 8v4l2.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{c.portalName ?? 'Smart Citizen Portal'}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{c.portalSub ?? 'Government of Bangladesh'}</div>
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Lang */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: lang === 'en' ? 700 : 400, color: lang === 'en' ? '#166534' : '#6B7280' }}>EN</button>
                <span style={{ color: '#d1d5db' }}>/</span>
                <button onClick={() => setLang('bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: lang === 'bn' ? 700 : 400, color: lang === 'bn' ? '#166534' : '#6B7280' }}>বাংলা</button>
            </div>
            {/* User name only (hide email on mobile) */}
            <div className="tp-user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{user?.name || user?.full_name || user?.email?.split('@')[0] || 'User'}</div>
            </div>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8"/></svg>
            </div>
            {/* Back to Dashboard */}
            <button onClick={onDashboard} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#166534' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dashboard
            </button>
            {/* Logout */}
            <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
        </div>
    </header>
);

/* ─────────────────────────────────────────
   MAIN TRACKING PAGE
───────────────────────────────────────── */
const TrackingPage = () => {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const user         = getUser();
    const { t, lang, setLang } = useLanguage();
    const c = t('common');

    const [app,     setApp]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        const fetchApp = async () => {
            try {
                setLoading(true);
                // Try fetching single application first
                let found = null;
                try {
                    const res = await api.get(`/applications/${id}`);
                    const p   = res?.data;
                    found = p?.data ?? p?.application ?? p;
                } catch {
                    // fallback — fetch all and find by id
                    const res  = await api.get('/applications/my');
                    const payload = res?.data;
                    const all =
                        Array.isArray(payload)               ? payload :
                        Array.isArray(payload?.data)         ? payload.data :
                        Array.isArray(payload?.applications) ? payload.applications :
                        Array.isArray(payload?.data?.data)   ? payload.data.data :
                        [];
                    found = all.find(a =>
                        String(a.app_id) === String(id) ||
                        String(a.id)     === String(id) ||
                        String(a.tracking_id) === String(id)
                    );
                }
                if (found) setApp(found);
                else setError('Application not found.');
            } catch {
                setError('Could not load application data.');
            } finally {
                setLoading(false);
            }
        };
        fetchApp();
    }, [id]);

    const handleLogout = () => { removeToken(); removeUser(); navigate('/login'); };

    /* ── LOADING ── */
    if (loading) return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <PageHeader onDashboard={() => navigate('/dashboard')} onLogout={handleLogout} user={user} lang={lang} setLang={setLang} c={c} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 68px)', gap: 16 }}>
                <div style={{ width: 44, height: 44, border: '3px solid #e5e7eb', borderTopColor: '#166534', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: '#6B7280', fontSize: 15 }}>Loading tracking info...</p>
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
        </div>
    );

    /* ── ERROR ── */
    if (error || !app) return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <PageHeader onDashboard={() => navigate('/dashboard')} onLogout={handleLogout} user={user} lang={lang} setLang={setLang} c={c} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 68px)', gap: 16 }}>
                <div style={{ width: 70, height: 70, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <p style={{ color: '#374151', fontSize: 16, fontWeight: 600 }}>{error || 'Application not found'}</p>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 24px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Back to Dashboard</button>
            </div>
        </div>
    );

    const stepIndex  = getStepIndex(app.status);
    const isRejected = app.status === 'rejected';
    const dateStr    = app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

    return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <PageHeader onDashboard={() => navigate('/dashboard')} onLogout={handleLogout} user={user} lang={lang} setLang={setLang} c={c} />

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px' }}>

                {/* ── Page title ── */}
                <div style={{ marginBottom: 28 }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, marginBottom: 12, padding: 0 }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0 }}>Application Tracker</h1>
                    <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Real-time status of your application</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>

                    {/* ── LEFT: Timeline ── */}
                    <div>
                        {/* Rejected banner */}
                        {isRejected && (
                            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '18px 22px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ width: 42, height: 42, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: '#991B1B', marginBottom: 4 }}>Application Rejected</div>
                                    <div style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.6 }}>
                                        {app.rejection_reason || 'Your application was not approved. Please contact the office or re-apply with correct documents.'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline card */}
                        <div style={{ background: 'white', borderRadius: 16, padding: '28px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 28 }}>Status Timeline</div>

                            {STATUS_STEPS.map((step, i) => {
                                const isDone    = !isRejected && i < stepIndex;
                                const isCurrent = !isRejected && i === stepIndex;
                                const isFuture  = isRejected || i > stepIndex;
                                const isLast    = i === STATUS_STEPS.length - 1;

                                const dotColor  = isDone ? '#22C55E' : isCurrent ? '#3B82F6' : '#D1D5DB';
                                const lineColor = isDone ? '#22C55E' : '#E5E7EB';

                                return (
                                    <div key={step.key} style={{ display: 'flex', gap: 18 }}>
                                        {/* Left: dot + line */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: '50%',
                                                background: isDone ? '#DCFCE7' : isCurrent ? '#DBEAFE' : '#F3F4F6',
                                                border: `2.5px solid ${dotColor}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: dotColor,
                                                transition: 'all 0.3s',
                                            }}>
                                                {isDone ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                ) : (
                                                    <span style={{ color: dotColor }}>{step.icon}</span>
                                                )}
                                            </div>
                                            {!isLast && (
                                                <div style={{ width: 2, flex: 1, minHeight: 32, background: lineColor, margin: '4px 0', borderRadius: 2 }} />
                                            )}
                                        </div>

                                        {/* Right: text */}
                                        <div style={{ paddingBottom: isLast ? 0 : 28, flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{
                                                    fontSize: 15, fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                                                    color: isDone ? '#166534' : isCurrent ? '#1D4ED8' : '#9CA3AF',
                                                }}>
                                                    {step.label}
                                                </span>
                                                {isCurrent && (
                                                    <span style={{ background: '#DBEAFE', color: '#1D4ED8', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #BFDBFE' }}>
                                                        CURRENT
                                                    </span>
                                                )}
                                                {isDone && (
                                                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #BBF7D0' }}>
                                                        DONE
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: 13, color: isFuture ? '#D1D5DB' : '#6B7280', margin: 0, lineHeight: 1.6 }}>
                                                {step.desc}
                                            </p>
                                            {/* Show date for submitted step */}
                                            {i === 0 && (
                                                <span style={{ display: 'inline-block', marginTop: 6, fontSize: 12, color: '#9CA3AF' }}>
                                                    📅 {dateStr}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── RIGHT: Info card ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Application summary */}
                        <div style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 18 }}>Application Summary</div>

                            {[
                                { label: 'Tracking ID',    value: app.tracking_id ?? app.id ?? '—',   mono: true },
                                { label: 'Service',        value: 'Birth Certificate' },
                                { label: 'Applicant',      value: app.child_name_bn || app.child_name_en || '—' },
                                { label: 'Applied On',     value: dateStr },
                                { label: 'Payable Fee',    value: `৳ ${app.fee_amount ?? app.fee ?? 100}` },
                                { label: 'Status',         value: app.status?.replace('_', ' ') ?? '—' },
                            ].map(({ label, value, mono }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6' }}>
                                    <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons based on status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {/* Pay Now — if pending */}
                            {app.status === 'pending' && (
                                <button
                                    onClick={() => navigate(`/payment/${app.app_id ?? app.id}`)}
                                    style={{
                                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                                        background: 'linear-gradient(135deg,#166534,#15803d)',
                                        color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        boxShadow: '0 4px 14px rgba(22,101,52,0.25)',
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="2"/><path d="M2 10h20" stroke="white" strokeWidth="2"/></svg>
                                    Pay Now — ৳{app.fee_amount ?? 100}
                                </button>
                            )}

                            {/* Download — if completed */}
                            {app.status === 'completed' && (
                                <button
                                    onClick={() => navigate(`/download/${app.app_id ?? app.id}`)}
                                    style={{
                                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                                        background: 'linear-gradient(135deg,#166534,#15803d)',
                                        color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="2" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                                    Download Certificate
                                </button>
                            )}

                            {/* Re-apply — if rejected */}
                            {app.status === 'rejected' && (
                                <button
                                    onClick={() => navigate('/apply/birth-certificate')}
                                    style={{
                                        width: '100%', padding: '13px', border: 'none', borderRadius: 12,
                                        background: 'linear-gradient(135deg,#DC2626,#B91C1C)',
                                        color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                    }}
                                >
                                    Re-apply
                                </button>
                            )}

                            {/* View Details */}
                            <button
                                onClick={() => navigate('/applications', { state: { selectedId: app.app_id ?? app.id } })}
                                style={{
                                    width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: 12,
                                    background: 'white', color: '#374151', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                                View Full Details
                            </button>

                            {/* Back to Dashboard */}
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    width: '100%', padding: '12px', border: '1.5px solid #d1d5db', borderRadius: 12,
                                    background: 'white', color: '#374151', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
