import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const statusConfig = {
    pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    processing: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
    verified:   { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    approved:   { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    completed:  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
    rejected:   { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

const getConfig = (status) => statusConfig[status] ?? statusConfig['pending'];

const PageHeader = ({ c }) => {
    const navigate          = useNavigate();
    const user              = getUser();
    const { lang, setLang } = useLanguage();

    const displayName = user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
    const displaySub  = user?.mobile || user?.email || '';

    const handleLogout = () => { removeToken(); removeUser(); navigate('/login'); };

    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 68,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>

            {/* LEFT — Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 42, height: 42,
                    background: 'linear-gradient(135deg,#166534,#15803d)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z"
                            fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>{c.portalName}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{c.portalSub}</div>
                </div>
            </div>

            {/* RIGHT — Lang + Bell + User + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

                {/* Language Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: '#6B7280' }}>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: lang === 'en' ? 700 : 400, color: lang === 'en' ? '#166534' : '#6B7280' }}>
                        {c.english}
                    </button>
                    <span style={{ color: '#d1d5db' }}>/</span>
                    <button onClick={() => setLang('bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: lang === 'bn' ? 700 : 400, color: lang === 'bn' ? '#166534' : '#6B7280' }}>
                        {c.bangla}
                    </button>
                </div>

                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

                {/* Bell */}
                <div style={{ position: 'relative', cursor: 'pointer', color: '#6B7280', display: 'flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
                </div>

                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

                {/* User */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{displayName}</div>
                        {displaySub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{displaySub}</div>}
                    </div>
                    <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8" />
                        </svg>
                    </div>
                </div>

                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title={c.logout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>

                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />

                {/* ✅ Back to Dashboard */}
                <button
                    onClick={() => navigate('/dashboard')}
                    title={c.backToDashboard ?? 'Back to Dashboard'}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                        borderRadius: 8, padding: '7px 14px',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#166534',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12l9-9 9 9" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 21V12h6v9" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {c.backToDashboard ?? 'Dashboard'}
                </button>
            </div>
        </header>
    );
};

const AppCard = ({ app, isSelected, onClick, label, d, st }) => {
    const cfg       = getConfig(app.status);
    const progress  = app.status === 'completed' ? 100 : app.status === 'processing' ? 60 : app.status === 'pending' ? 20 : 0;
    const dateStr   = app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : app.date || '—';

    return (
        <div
            onClick={onClick}
            style={{
                background: 'white',
                borderRadius: 16,
                padding: '20px 22px',
                marginBottom: 14,
                cursor: 'pointer',
                border: isSelected ? '2px solid #10B981' : '1.5px solid #e5e7eb',
                transition: 'border 0.15s, box-shadow 0.15s',
                boxShadow: isSelected ? '0 4px 16px rgba(16,185,129,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            {/* Top row — icon + title + badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Clock icon */}
                    <div style={{ width: 36, height: 36, background: '#FFF7ED', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.8" />
                            <path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>{label}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{app.tracking_id || app.id}</div>
                    </div>
                </div>

                {/* Status badge */}
                <div style={{
                    background: cfg.bg, color: cfg.text,
                    padding: '5px 14px', borderRadius: 20,
                    fontSize: 12, fontWeight: 600,
                    flexShrink: 0,
                }}>
                    {st?.[app.status] ?? app.status}
                </div>
            </div>

            {/* Progress */}
            <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{d.progress}</span>
                    <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: 7, background: '#e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg,#10B981,#059669)',
                        borderRadius: 10,
                        transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>

            {/* Footer — date + payment */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13, color: '#6B7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {d.applied}: {dateStr}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    {d.payment}: {st?.[app.status] ?? app.status}
                </div>
            </div>
        </div>
    );
};

const DetailPanel = ({ app, label, d, st, onPayNow, onTrack, onDownload }) => {
    const cfg     = getConfig(app.status);
    const dateStr = app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : app.date || '—';

    return (
        <div style={{
            background: 'white',
            borderRadius: 18,
            padding: '28px 26px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            position: 'sticky',
            top: 88,
        }}>
            {/* Title */}
            <div style={{ fontWeight: 700, fontSize: 20, color: '#111827', marginBottom: 24 }}>
                {d.appDetails}
            </div>

            {/* Detail rows */}
            <DetailRow label={d.serviceType} value={label} />

            <div style={{ height: 1, background: '#f3f4f6', margin: '14px 0' }} />

            <DetailRow label={d.appNumber} value={app.tracking_id || app.id} mono />

            <div style={{ height: 1, background: '#f3f4f6', margin: '14px 0' }} />

            <DetailRow label={d.statusLabel} value={st?.[app.status] ?? app.status} />

            <div style={{ height: 1, background: '#f3f4f6', margin: '14px 0' }} />

            {/* Service Fee */}
            <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>{d.serviceFee}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#059669', lineHeight: 1, letterSpacing: '-0.5px' }}>
                    ৳{app.fee ?? 50}
                </div>
            </div>

            <div style={{ height: 1, background: '#f3f4f6', margin: '14px 0' }} />

            {/* Payment Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>{d.paymentStatus}</span>
                <span style={{
                    background: cfg.bg, color: cfg.text,
                    padding: '3px 12px', borderRadius: 20,
                    fontSize: 12, fontWeight: 600,
                }}>
                    {st?.[app.status] ?? app.status}
                </span>
            </div>

            <div style={{ height: 1, background: '#f3f4f6', margin: '18px 0' }} />

            {/* Timeline */}
            <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 12 }}>{d.timeline}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{d.applied}: {dateStr}</span>
                </div>
                {(app.status === 'processing' || app.status === 'completed') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingLeft: 0 }}>
                        <div style={{ width: 1, height: 20, background: '#d1d5db', marginLeft: 4, marginRight: 5 }} />
                    </div>
                )}
                {app.status === 'completed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#374151' }}>{d.completed}</span>
                    </div>
                )}
            </div>

            {/* Pay Now button — only if pending */}
            {app.status === 'pending' && (
                <button
                    onClick={onPayNow}
                    style={{
                        width: '100%',
                        marginTop: 24,
                        padding: '14px',
                        border: 'none',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg,#10B981,#059669)',
                        color: 'white',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: 15,
                        letterSpacing: '0.2px',
                        boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    {d.payNow}
                </button>
            )}

            {/* Track button — if processing */}
            {app.status === 'processing' && (
                <button
                    onClick={onTrack}
                    style={{ width: '100%', marginTop: 24, padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                >
                    {d.trackBtn}
                </button>
            )}

            {/* Download button — if completed */}
            {app.status === 'completed' && (
                <button
                    onClick={onDownload}
                    style={{ width: '100%', marginTop: 24, padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg,#166534,#15803d)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                >
                    {d.downloadBtn}
                </button>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, mono }) => (
    <div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</div>
    </div>
);

const EmptyState = ({ onApply, d }) => (
    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 16, border: '1.5px dashed #d1d5db' }}>
        <div style={{ width: 72, height: 72, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#166534" strokeWidth="1.6" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" stroke="#166634" strokeWidth="1.6" />
                <path d="M12 12v4M10 14h4" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{d.emptyTitle}</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.7 }}>{d.emptySub1}</div>
        <button onClick={onApply} style={{ padding: '11px 28px', border: 'none', borderRadius: 10, background: '#166534', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {d.emptyBtn}
        </button>
    </div>
);

const ApplicationDashboard = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { t }     = useLanguage();

    const c  = t('common');
    const st = t('status');
    const ap = t('applicationDetail');

    /* page-level strings — with fallback so it works even without translation keys */
    const d = {
        appDetails:    ap.title          ?? 'Application Details',
        serviceType:   ap.serviceType    ?? 'Service Type',
        appNumber:     ap.appNumber      ?? 'Application Number',
        statusLabel:   ap.statusLabel    ?? 'Status',
        serviceFee:    ap.serviceFee     ?? 'Service Fee',
        paymentStatus: ap.paymentStatus  ?? 'Payment Status',
        timeline:      ap.timeline       ?? 'Timeline',
        applied:       ap.applied        ?? 'Applied',
        completed:     ap.completedOn    ?? 'Completed',
        payNow:        ap.payNow         ?? 'Pay Now',
        trackBtn:      ap.trackBtn       ?? 'Track Application',
        downloadBtn:   ap.downloadBtn    ?? 'Download',
        progress:      ap.progress       ?? 'Progress',
        payment:       ap.payment        ?? 'Payment',
        emptyTitle:    ap.emptyTitle     ?? 'No Applications Yet',
        emptySub1:     ap.emptySub1      ?? 'You have not applied for any service yet.',
        emptyBtn:      ap.emptyBtn       ?? 'Apply for Birth Certificate',
        serviceLabel:  ap.serviceLabel   ?? 'Birth Certificate',
    };

    const [applications, setApplications] = useState([]);
    const [selected, setSelected]         = useState(null);
    const [loading, setLoading]           = useState(true);

    const fetchApps = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/citizen/applications');
            const payload  = response?.data;
            const data =
                Array.isArray(payload)               ? payload :
                Array.isArray(payload?.data)         ? payload.data :
                Array.isArray(payload?.applications) ? payload.applications :
                Array.isArray(payload?.data?.data)   ? payload.data.data :
                [];
            setApplications(data);
            if (data.length > 0) {
                const sid    = location.state?.selectedId;
                const target = sid
                    ? (data.find(a => String(a.app_id) === String(sid) || String(a.id) === String(sid)) ?? data[0])
                    : data[0];
                setSelected(target);
            }
        } catch {
            setApplications([]);
        } finally {
            setLoading(false);
        }
    }, [location.state?.selectedId]);

    useEffect(() => { fetchApps(); }, [fetchApps]);

    const serviceLabel = (type) =>
        type === 'birth_certificate' ? d.serviceLabel : type ?? d.serviceLabel;

    /* Loading */
    if (loading) return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <PageHeader c={c} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 68px)', gap: 16 }}>
                <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: '#6B7280', fontSize: 15 }}>{c.loading}</p>
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
        </div>
    );

    return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f0f4f3', minHeight: '100vh' }}>

            <PageHeader c={c} />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 380px',
                gap: 0,
                minHeight: 'calc(100vh - 68px)',
            }}>

                
                <div style={{ padding: '28px 24px 28px 28px', overflowY: 'auto' }}>

                    {applications.length === 0 ? (
                        <EmptyState onApply={() => navigate('/apply/birth-certificate')} d={d} />
                    ) : (
                        applications.map((app) => (
                            <AppCard
                                key={app.app_id ?? app.id}
                                app={app}
                                isSelected={selected?.app_id === app.app_id || selected?.id === app.id}
                                onClick={() => setSelected(app)}
                                label={serviceLabel(app.service_type)}
                                d={d}
                                st={st}
                            />
                        ))
                    )}
                </div>

                
                <div style={{
                    borderLeft: '1px solid #e5e7eb',
                    background: '#eef2f1',
                    padding: '28px 24px 28px 20px',
                }}>
                    {selected ? (
                        <DetailPanel
                            app={selected}
                            label={serviceLabel(selected.service_type)}
                            d={d}
                            st={st}
                            onPayNow={()   => navigate(`/payment/${selected.app_id  ?? selected.id}`)}
                            onTrack={()    => navigate(`/track/${selected.app_id    ?? selected.id}`)}
                            onDownload={() => navigate(`/download/${selected.app_id ?? selected.id}`)}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF', fontSize: 14 }}>
                            {d.appDetails}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDashboard;
