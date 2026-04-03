import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';

const Modal = ({ onClose, children }) => (
    <div
        onClick={onClose}
        style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20,
        }}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                background: 'white', borderRadius: 16, width: '100%', maxWidth: 520,
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
        >
            {children}
        </div>
    </div>
);

const ModalHeader = ({ title, subtitle, onClose }) => (
    <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#111827' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </button>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f9fafb' }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
        <span style={{ fontSize: 13, color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
);

//   VIEW DETAILS MODAL

const ViewDetailsModal = ({ app, onClose }) => {
    const badge = getStatusBadge(app.status);
    return (
        <Modal onClose={onClose}>
            <ModalHeader title="আবেদনের বিস্তারিত" subtitle={`#${app.tracking_id}`} onClose={onClose} />
            <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                        {app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন আবেদন' : 'পাসপোর্ট আবেদন'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot, display: 'inline-block' }} />
                        {badge.label}
                    </span>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 14px', marginBottom: 20 }}>
                    <InfoRow label="ট্র্যাকিং আইডি" value={`#${app.tracking_id}`} />
                    <InfoRow label="আবেদনকারী" value={app.applicant_name || '—'} />
                    <InfoRow label="সেবার ধরন" value={app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন' : 'পাসপোর্ট'} />
                    <InfoRow label="বিভাগ" value={app.department || 'সিভিল রেজিস্ট্রেশন'} />
                    <InfoRow label="জমা দেওয়া হয়েছে" value={app.created_at ? new Date(app.created_at).toLocaleDateString('bn-BD') : '—'} />
                    <InfoRow label="ফি" value={app.fee ? `৳ ${app.fee}` : '—'} />
                    <InfoRow label="স্ট্যাটাস" value={badge.label} />
                </div>
                <button onClick={onClose} style={{ width: '100%', padding: 10, border: '1.5px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                    বন্ধ করুন
                </button>
            </div>
        </Modal>
    );
};

//   PAY NOW MODAL

const PayNowModal = ({ app, onClose }) => (
    <Modal onClose={onClose}>
        <ModalHeader title="পেমেন্ট সম্পন্ন করুন" subtitle={`#${app.tracking_id}`} onClose={onClose} />
        <div style={{ padding: '20px 24px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="1.6" />
                    <path d="M12 8v4l2 2" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>পেমেন্ট গেটওয়ে</div>
                    <div style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>পেমেন্ট গেটওয়ে শীঘ্রই সংযুক্ত হবে। আপনার আবেদন সংরক্ষিত আছে।</div>
                </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 14px', marginBottom: 20 }}>
                <InfoRow label="সেবা" value={app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন আবেদন' : 'পাসপোর্ট আবেদন'} />
                <InfoRow label="ট্র্যাকিং আইডি" value={`#${app.tracking_id}`} />
                <InfoRow label="প্রদেয় পরিমাণ" value={app.fee ? `৳ ${app.fee}` : '৳ —'} />
            </div>
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10, fontWeight: 500 }}>পেমেন্ট পদ্ধতি বেছে নিন</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {['bKash', 'Nagad', 'Rocket', 'কার্ড / ব্যাংক'].map((m) => (
                        <div key={m} style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 8, background: 'white' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />
                            {m}
                        </div>
                    ))}
                </div>
            </div>
            <button style={{ width: '100%', padding: 12, border: 'none', borderRadius: 10, background: '#166534', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white' }}>
                পেমেন্ট করুন {app.fee ? `৳ ${app.fee}` : ''}
            </button>
        </div>
    </Modal>
);

//   TRACK STATUS MODAL

const TRACK_STEPS = [
    { key: 'submitted',    label: 'আবেদন জমা হয়েছে',         statuses: ['pending', 'processing', 'verified', 'approved', 'completed'] },
    { key: 'verified',     label: 'কাগজপত্র যাচাই',           statuses: ['processing', 'verified', 'approved', 'completed'] },
    { key: 'review',       label: 'কর্মকর্তার পর্যালোচনা',    statuses: ['verified', 'approved', 'completed'] },
    { key: 'approved',     label: 'অনুমোদনের অপেক্ষায়',       statuses: ['approved', 'completed'] },
    { key: 'ready',        label: 'সার্টিফিকেট প্রস্তুত',      statuses: ['completed'] },
];

const TrackStatusModal = ({ app, onClose }) => (
    <Modal onClose={onClose}>
        <ModalHeader title="আবেদনের অগ্রগতি" subtitle={`#${app.tracking_id}`} onClose={onClose} />
        <div style={{ padding: '20px 24px' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 500 }}>
                    {app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন আবেদন' : 'পাসপোর্ট আবেদন'}
                </span>
                <span style={{ fontSize: 12, color: '#3B82F6' }}>#{app.tracking_id}</span>
            </div>

            <div>
                {TRACK_STEPS.map((step, i) => {
                    const done = step.statuses.includes(app.status);
                    const isLast = i === TRACK_STEPS.length - 1;
                    return (
                        <div key={step.key} style={{ display: 'flex', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#166534' : '#f3f4f6', border: `2px solid ${done ? '#166534' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {done ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />
                                    )}
                                </div>
                                {!isLast && <div style={{ width: 2, flex: 1, minHeight: 32, background: done ? '#166534' : '#e5e7eb', margin: '4px 0' }} />}
                            </div>
                            <div style={{ paddingBottom: isLast ? 0 : 24 }}>
                                <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? '#111827' : '#9CA3AF' }}>{step.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={onClose} style={{ width: '100%', marginTop: 24, padding: 10, border: '1.5px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                বন্ধ করুন
            </button>
        </div>
    </Modal>
);

//   DOWNLOAD MODAL
const DownloadModal = ({ app, onClose }) => {
    const [downloading, setDownloading] = useState(false);
    const [done, setDone] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => { setDownloading(false); setDone(true); }, 1800);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="সার্টিফিকেট ডাউনলোড" subtitle={`#${app.tracking_id}`} onClose={onClose} />
            <div style={{ padding: '20px 24px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#166534" strokeWidth="1.6" />
                            <polyline points="14 2 14 8 20 8" stroke="#166534" strokeWidth="1.6" />
                            <path d="M9 15l3 3 3-3M12 12v6" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#166534' }}>সার্টিফিকেট প্রস্তুত</div>
                    <div style={{ fontSize: 12, color: '#15803D', marginTop: 4 }}>আপনার সার্টিফিকেট ডাউনলোডের জন্য প্রস্তুত</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 14px', marginBottom: 20 }}>
                    <InfoRow label="সেবা" value={app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন' : 'পাসপোর্ট'} />
                    <InfoRow label="ট্র্যাকিং আইডি" value={`#${app.tracking_id}`} />
                    <InfoRow label="ফরম্যাট" value="PDF ডকুমেন্ট" />
                </div>
                {done ? (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5 9-9" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>ডাউনলোড সম্পন্ন হয়েছে!</span>
                    </div>
                ) : (
                    <button onClick={handleDownload} disabled={downloading} style={{ width: '100%', padding: 12, border: 'none', borderRadius: 10, background: downloading ? '#4ade80' : '#166534', cursor: downloading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {downloading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="28 56" />
                                </svg>
                                ডাউনলোড হচ্ছে...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                                    <polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                সার্টিফিকেট ডাউনলোড করুন (PDF)
                            </>
                        )}
                    </button>
                )}
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </Modal>
    );
};

//   STATUS BADGE HELPER  (module-level so modals can use it)

function getStatusBadge(status) {
    const map = {
        pending:    { label: 'পেমেন্ট বাকি',  bg: '#FFF4E5', text: '#B45309', border: '#F5C369', dot: '#F59E0B' },
        processing: { label: 'চলমান',          bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD', dot: '#3B82F6' },
        verified:   { label: 'যাচাইকৃত',       bg: '#F0FDF4', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
        approved:   { label: 'অনুমোদিত',       bg: '#F0FDF4', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
        completed:  { label: 'সম্পন্ন',         bg: '#F0FDF4', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
        rejected:   { label: 'বাতিল',           bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
    };
    return map[status] || map['pending'];
}

//   STAT CARD

const StatCard = ({ label, value, total, color, barColor, icon, isActive, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'white', borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
            border: isActive ? `2px solid ${barColor}` : '1.5px solid #e5e7eb',
            transition: 'all 0.18s ease',
            boxShadow: isActive ? `0 4px 16px ${barColor}30` : '0 1px 3px rgba(0,0,0,0.04)',
            transform: isActive ? 'translateY(-2px)' : 'none',
            userSelect: 'none',
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>{label}</span>
            {icon}
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, color: isActive ? color : '#111827', lineHeight: 1, marginBottom: 14 }}>
            {value}
        </div>
        <div style={{ height: 3, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: total > 0 ? `${Math.round((value / total) * 100)}%` : '0%', background: barColor, borderRadius: 2, minWidth: value > 0 ? '10%' : '0', transition: 'width 0.4s ease' }} />
        </div>
    </div>
);

//   MAIN DASHBOARD

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const user = getUser();

    const [loading, setLoading]           = useState(true);
    const [applications, setApplications] = useState([]);
    const [stats, setStats]               = useState({ total: 1, pending: 1, inProgress: 1, completed: 1 });
    const [activeTab, setActiveTab]       = useState('all');
    const [searchQuery, setSearchQuery]   = useState('');
    const [timeFilter, setTimeFilter]     = useState('all');

    /* modal state */
    const [viewApp,     setViewApp]     = useState(null);
    const [payApp,      setPayApp]      = useState(null);
    const [trackApp,    setTrackApp]    = useState(null);
    const [downloadApp, setDownloadApp] = useState(null);

    useEffect(() => { fetchDashboardData(); }, []);
    const FALLBACK_APPLICATIONS = [
        { app_id: 'F001', tracking_id: 'TRK-2024-001', service_type: 'birth_certificate', status: 'pending',    department: 'স্থানীয় সরকার', created_at: '2024-01-15T00:00:00Z', fee: 250 },
        { app_id: 'F002', tracking_id: 'TRK-2024-002', service_type: 'birth_certificate', status: 'processing', department: 'স্থানীয় সরকার', created_at: '2024-01-18T00:00:00Z', fee: 150 },
        { app_id: 'F003', tracking_id: 'TRK-2024-003', service_type: 'birth_certificate', status: 'completed',  department: 'স্থানীয় সরকার', created_at: '2024-01-22T00:00:00Z', fee: 200 },
    ];
    
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/citizen/applications');
            const data = (response.success && response.data?.length > 0)
                ? response.data
                : FALLBACK_APPLICATIONS;               // ← API empty হলে fallback
    
            setApplications(data);
            setStats({
                total:      data.length,
                pending:    data.filter(a => a.status === 'pending').length,
                inProgress: data.filter(a => a.status === 'processing').length,
                completed:  data.filter(a => a.status === 'completed').length,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setApplications(FALLBACK_APPLICATIONS);    // ← error হলেও fallback
            setStats({ total: 3, pending: 1, inProgress: 1, completed: 1 });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { removeToken(); removeUser(); navigate('/login'); };

    const filteredApplications = applications.filter(app => {
        
        const tabMatch =
        activeTab === 'all'  ||
        activeTab === 'total' ||                            
        (activeTab === 'pending'     && app.status === 'pending') ||
        (activeTab === 'in-progress' && app.status === 'processing') ||
        (activeTab === 'completed'   && app.status === 'completed');

        const searchMatch = !searchQuery || (() => {
            const q = searchQuery.toLowerCase();
            return app.tracking_id.toLowerCase().includes(q) || app.service_type.toLowerCase().includes(q);
        })();

        return tabMatch && searchMatch;
    });

    /* ── loading screen ── */
    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, background: '#f4f6f4', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#166534', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: '#6B7280', fontSize: 15 }}>লোড হচ্ছে...</p>
                <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
            </div>
        );
    }

    /* ── STAT CARDS CONFIG ── */
    const statCards = [
        {
            key: 'total', label: 'মোট আবেদন', value: stats.total, color: '#1f2937', barColor: '#374151',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6B7280" strokeWidth="1.6" /><polyline points="14 2 14 8 20 8" stroke="#6B7280" strokeWidth="1.6" /></svg>,
        },
        {
            key: 'pending', label: 'পেন্ডিং', value: stats.pending, color: '#D97706', barColor: '#F59E0B',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.6" /><path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" /></svg>,
        },
        {
            key: 'in-progress', label: 'চলমান', value: stats.inProgress, color: '#2563EB', barColor: '#3B82F6',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth="1.6" /><path d="M12 8v4l2 2" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" /></svg>,
        },
        {
            key: 'completed', label: 'সম্পন্ন', value: stats.completed, color: '#16A34A', barColor: '#22C55E',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="1.6" /><path d="M8 12l3 3 5-5" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        },
    ];

    /* ── RENDER ── */
    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f4f6f4', minHeight: '100vh', color: '#1f2937' }}>

            {/* ── MODALS ── */}
            {viewApp     && <ViewDetailsModal app={viewApp}     onClose={() => setViewApp(null)} />}
            {payApp      && <PayNowModal      app={payApp}      onClose={() => setPayApp(null)} />}
            {trackApp    && <TrackStatusModal app={trackApp}    onClose={() => setTrackApp(null)} />}
            {downloadApp && <DownloadModal    app={downloadApp} onClose={() => setDownloadApp(null)} />}

            {/* ── HEADER ── */}
            <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, background: '#166534', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h18v18H3z" stroke="white" strokeWidth="1.5" fill="none" />
                            <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', lineHeight: 1.2 }}>স্মার্ট সিটিজেন সার্ভিস ট্র্যাকার</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>বাংলাদেশ ডিজিটাল সার্ভিস</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ position: 'relative', cursor: 'pointer', color: '#4B5563' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4B5563', fontSize: 14 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /></svg>
                        <span>{user?.email || user?.mobile || 'User'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 14, color: '#374151', fontWeight: 500 }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        লগআউট
                    </button>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main style={{ padding: 32 }}>

                {/* STAT CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {statCards.map(c => (
                        <StatCard
                            key={c.key}
                            {...c}
                            total={stats.total}
                            isActive={activeTab === c.key}
                            onClick={() => setActiveTab(c.key)}
                        />
                    ))}
                </div>

                {/* TABS + NEW REQUEST */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 4, gap: 2 }}>
                        {[
                            { key: 'all',         label: 'সব আবেদন' },
                            { key: 'pending',     label: 'পেন্ডিং' },
                            { key: 'in-progress', label: 'চলমান' },
                            { key: 'completed',   label: 'সম্পন্ন' },
                        ].map(t => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === t.key ? 600 : 400, background: activeTab === t.key ? '#166534' : 'transparent', color: activeTab === t.key ? 'white' : '#6B7280', transition: 'all 0.15s ease' }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#166534', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                        নতুন আবেদন
                    </button>
                </div>

                {/* SEARCH + TIME FILTER */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="ট্র্যাকিং আইডি বা সেবার নাম দিয়ে খুঁজুন"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 42px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', background: 'white', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <select
                        value={timeFilter}
                        onChange={e => setTimeFilter(e.target.value)}
                        style={{ padding: '11px 40px 11px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', minWidth: 160, appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                    >
                        <option value="all">সব সময়</option>
                        <option value="week">এই সপ্তাহ</option>
                        <option value="month">এই মাস</option>
                        <option value="year">এই বছর</option>
                    </select>
                </div>

                {/* APPLICATION CARDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredApplications.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: 14, padding: '48px 24px', textAlign: 'center', border: '1.5px solid #e5e7eb', color: '#9CA3AF', fontSize: 15 }}>
                            কোনো আবেদন পাওয়া যায়নি
                        </div>
                    ) : (
                        filteredApplications.map(app => {
                            const badge = getStatusBadge(app.status);
                            return (
                                <div key={app.app_id} style={{ background: 'white', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '22px 26px' }}>

                                    {/* Card Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>
                                                {app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন আবেদন' : 'পাসপোর্ট আবেদন'}
                                            </span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot, display: 'inline-block' }} />
                                                {badge.label}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'monospace', fontWeight: 500, whiteSpace: 'nowrap' }}>#{app.tracking_id}</span>
                                    </div>

                                    {/* Description */}
                                    {app.description && (
                                        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 16px' }}>{app.description}</p>
                                    )}

                                    {/* Meta Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
                                        {[
                                            {
                                                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
                                                text: 'সিভিল রেজিস্ট্রেশন',
                                            },
                                            {
                                                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
                                                text: app.department || 'স্থানীয় সরকার',
                                            },
                                            {
                                                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
                                                text: app.created_at ? new Date(app.created_at).toLocaleDateString('bn-BD') : '—',
                                            },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>
                                                {item.svg}{item.text}
                                            </div>
                                        ))}
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

                                        {/* View Details — সবসময় থাকবে */}
                                        <button
                                            onClick={() => setViewApp(app)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', border: '1.5px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.6" /></svg>
                                            বিস্তারিত দেখুন
                                        </button>

                                        {/* Pay Now — শুধু pending এর জন্য */}
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => setPayApp(app)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', border: 'none', borderRadius: 8, background: '#166534', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white' }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.6" /><path d="M2 10h20" stroke="white" strokeWidth="1.6" /></svg>
                                                পেমেন্ট করুন
                                            </button>
                                        )}

                                        {/* Track Status — শুধু processing এর জন্য */}
                                        {app.status === 'processing' && (
                                            <button
                                                onClick={() => setTrackApp(app)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', border: 'none', borderRadius: 8, background: '#1D4ED8', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white' }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" /><path d="M12 8v4l2 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                                                ট্র্যাক করুন
                                            </button>
                                        )}

                                        {/* Download — শুধু completed এর জন্য */}
                                        {app.status === 'completed' && (
                                            <button
                                                onClick={() => setDownloadApp(app)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', border: 'none', borderRadius: 8, background: '#166534', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white' }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" /><polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
                                                ডাউনলোড
                                            </button>
                                        )}

                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default CitizenDashboard;
