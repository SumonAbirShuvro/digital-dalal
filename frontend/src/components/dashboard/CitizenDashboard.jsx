import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';
import { useLanguage, LangSwitcher } from '../../context/LanguageContext';

function getStatusBadge(status, statusT) {
    const defaultLabels = {
        pending:    'Payment Pending',
        processing: 'In Progress',
        completed:  'Completed',
        verified:   'Verified',
        approved:   'Approved',
        rejected:   'Rejected',
    };
    const label = statusT?.[status] ?? defaultLabels[status] ?? status;
    const styles = {
        pending:    { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', dot: '#F97316' },
        processing: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
        verified:   { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E' },
        approved:   { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E' },
        completed:  { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#22C55E' },
        rejected:   { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
    };
    return { label, ...(styles[status] ?? styles['pending']) };
}

const StatCard = ({ label, value, total, color, barColor, icon, isActive, onClick }) => (
    <div onClick={onClick} style={{
        background: 'white', borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        border: isActive ? `2px solid ${barColor}` : '1.5px solid #e5e7eb',
        transition: 'all 0.18s ease',
        boxShadow: isActive ? `0 4px 16px ${barColor}30` : '0 1px 3px rgba(0,0,0,0.04)',
        transform: isActive ? 'translateY(-2px)' : 'none', userSelect: 'none',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>{label}</span>
            {icon}
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, color: isActive ? color : '#111827', lineHeight: 1, marginBottom: 14 }}>{value}</div>
        <div style={{ height: 3, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: total > 0 ? `${Math.round((value / total) * 100)}%` : '0%', background: barColor, borderRadius: 2, minWidth: value > 0 ? '10%' : '0', transition: 'width 0.4s ease' }} />
        </div>
    </div>
);

const EmptyState = ({ onApply, d }) => (
    <div style={{ background: 'white', borderRadius: 16, padding: '52px 24px', border: '1.5px dashed #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#16A34A" strokeWidth="1.6" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" stroke="#16A34A" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M12 12v4M10 14h4" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        </div>
        <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{d.emptyTitle}</div>
            <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 320 }}>{d.emptySub1}<br />{d.emptySub2}</div>
        </div>
        <button onClick={onApply} style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg,#166534,#15803d)', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white', boxShadow: '0 2px 8px rgba(22,101,52,0.25)' }}>
            {d.emptyBtn}
        </button>
    </div>
);


const DeleteModal = ({ app, onConfirm, onCancel, deleting }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '32px 28px', maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6M14 11v6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>আবেদন মুছে ফেলুন?</div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 8, lineHeight: 1.6 }}>
                <strong style={{ color: '#374151' }}>{app?.tracking_id}</strong> এই আবেদনটি স্থায়ীভাবে মুছে যাবে।
            </div>
            <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', borderRadius: 8, padding: '8px 14px', marginBottom: 24 }}>
                ⚠️ এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={onCancel} disabled={deleting} style={{ flex: 1, padding: '12px', border: '1.5px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
                    বাতিল করুন
                </button>
                <button onClick={onConfirm} disabled={deleting} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: deleting ? '#9CA3AF' : '#DC2626', color: 'white', fontWeight: 700, fontSize: 14, cursor: deleting ? 'not-allowed' : 'pointer' }}>
                    {deleting ? 'মুছছে...' : '🗑️ মুছে ফেলুন'}
                </button>
            </div>
        </div>
    </div>
);


const SuccessToast = ({ message }) => (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#166534', color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: 8 }}>
        ✅ {message}
    </div>
);

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const user     = getUser();
    const { t }    = useLanguage();
    const d  = t('dashboard');
    const c  = t('common');
    const st = t('status');

    const [loading, setLoading]           = useState(true);
    const [applications, setApplications] = useState([]);
    const [stats, setStats]               = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [activeTab, setActiveTab]       = useState('all');
    const [searchQuery, setSearchQuery]   = useState('');
    const [timeFilter, setTimeFilter]     = useState('all');
    const [notifications, setNotifications]   = useState([]);
    const [unreadCount, setUnreadCount]       = useState(0);
    const [showNotifPanel, setShowNotifPanel] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [toast, setToast]               = useState('');

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/applications/my');
            const payload  = response?.data;
            const raw =
                Array.isArray(payload)               ? payload :
                Array.isArray(payload?.data)         ? payload.data :
                Array.isArray(payload?.applications) ? payload.applications :
                Array.isArray(payload?.data?.data)   ? payload.data.data : [];

            setApplications(raw);
            setStats({
                total:      raw.length,
                pending:    raw.filter(a => a.status === 'pending' || a.status === 'rejected').length,
                inProgress: raw.filter(a => a.status === 'processing').length,
                completed:  raw.filter(a => a.status === 'completed').length,
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setApplications([]);
            setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const res  = await api.get('/notifications');
            const data = res?.data?.data ?? res?.data ?? {};
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error('Notification fetch error:', err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchNotifications();
    }, [fetchDashboardData]);

    const handleMarkRead = async (notifId) => {
        try {
            await api.patch(`/notifications/${notifId}/read`);
            setNotifications(prev => prev.map(n => n.notif_id === notifId ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

  
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/applications/${deleteTarget.app_id}`);
            setApplications(prev => prev.filter(a => a.app_id !== deleteTarget.app_id));
            setStats(prev => ({ ...prev, total: prev.total - 1, pending: Math.max(0, prev.pending - 1) }));
            setDeleteTarget(null);
            setToast('আবেদনটি সফলভাবে মুছে ফেলা হয়েছে!');
            setTimeout(() => setToast(''), 3000);
        } catch (err) {
            console.error('Delete error:', err);
            alert('মুছতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setDeleting(false);
        }
    };

    const handleLogout = () => { removeToken(); removeUser(); navigate('/login'); };

    const filteredApplications = applications.filter(app => {
        const tabMatch =
            activeTab === 'all' || activeTab === 'total' ||
            (activeTab === 'pending'     && (app.status === 'pending' || app.status === 'rejected')) ||
            (activeTab === 'in-progress' && app.status === 'processing') ||
            (activeTab === 'completed'   && app.status === 'completed');

        const searchMatch = !searchQuery || (() => {
            const q = searchQuery.toLowerCase();
            return (app.tracking_id  ?? '').toLowerCase().includes(q) ||
                   (app.service_type ?? '').toLowerCase().includes(q) ||
                   (app.child_name_bn ?? '').toLowerCase().includes(q);
        })();

        const timeMatch = (() => {
            if (timeFilter === 'all' || !app.created_at) return true;
            const created = new Date(app.created_at);
            const now     = new Date();
            if (timeFilter === 'week')  { const d = new Date(now); d.setDate(now.getDate() - 7);  return created >= d; }
            if (timeFilter === 'month') { const d = new Date(now); d.setMonth(now.getMonth() - 1); return created >= d; }
            if (timeFilter === 'year')  { return created.getFullYear() === now.getFullYear(); }
            return true;
        })();

        return tabMatch && searchMatch && timeMatch;
    });

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, background: '#f4f6f4', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#166534', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#6B7280', fontSize: 15 }}>{c.loading}</p>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const statCards = [
        { key: 'total',       label: d.statTotal,      value: stats.total,      color: '#1f2937', barColor: '#374151', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6B7280" strokeWidth="1.6" /><polyline points="14 2 14 8 20 8" stroke="#6B7280" strokeWidth="1.6" /></svg> },
        { key: 'pending',     label: d.statPending,    value: stats.pending,    color: '#D97706', barColor: '#F59E0B', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.6" /><path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" /></svg> },
        { key: 'in-progress', label: d.statInProgress, value: stats.inProgress, color: '#2563EB', barColor: '#3B82F6', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth="1.6" /><path d="M12 8v4l2 2" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" /></svg> },
        { key: 'completed',   label: d.statCompleted,  value: stats.completed,  color: '#16A34A', barColor: '#22C55E', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="1.6" /><path d="M8 12l3 3 5-5" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    ];

    return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh', color: '#1f2937' }}>
            <style>{`
                @media (max-width: 600px) { .cd-email-text { display: none; } }
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            {/* ✅ Delete Modal */}
            {deleteTarget && (
                <DeleteModal
                    app={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}

            {/* ✅ Success Toast */}
            {toast && <SuccessToast message={toast} />}

            <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '10px clamp(12px,3vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, minHeight: 70, position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, background: '#166534', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h18v18H3z" stroke="white" strokeWidth="1.5" fill="none" />
                            <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', lineHeight: 1.2 }}>{d.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{d.subtitle}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <LangSwitcher />

                    {/* Notification Bell */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowNotifPanel(p => !p); if (!showNotifPanel) fetchNotifications(); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563', position: 'relative', padding: 4 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: -2, right: -2, background: '#EF4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifPanel && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', width: 340, background: 'white', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', zIndex: 500, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>
                                        নোটিফিকেশন {unreadCount > 0 && <span style={{ background: '#EF4444', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, marginLeft: 6 }}>{unreadCount}</span>}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#166534', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                            সব পড়া হিসেবে চিহ্নিত করুন
                                        </button>
                                    )}
                                </div>
                                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280', fontSize: 13 }}>কোনো নোটিফিকেশন নেই</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.notif_id} onClick={() => !n.is_read && handleMarkRead(n.notif_id)} style={{ padding: '12px 16px', borderBottom: '1px solid #f9fafb', background: n.is_read ? 'white' : '#f0fdf4', cursor: n.is_read ? 'default' : 'pointer' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                                    {!n.is_read && <div style={{ width: 8, height: 8, background: '#166534', borderRadius: '50%', flexShrink: 0, marginTop: 5 }}/>}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 13, fontWeight: n.is_read ? 400 : 700, color: '#111', marginBottom: 3 }}>{n.title}</div>
                                                        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{n.message}</div>
                                                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                                                            {new Date(n.sent_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4B5563', fontSize: 14 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <span className="cd-email-text">{user?.email || user?.mobile || 'User'}</span>
                    </div>

                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 14, color: '#374151', fontWeight: 500 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        {c.logout}
                    </button>
                </div>
            </header>

            <main style={{ padding: 'clamp(16px, 3vw, 32px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 28 }}>
                    {statCards.map(card => (
                        <StatCard key={card.key} {...card} total={Math.max(stats.total, 1)} isActive={activeTab === card.key} onClick={() => setActiveTab(card.key)} />
                    ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'inline-flex', background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 4, gap: 2 }}>
                        {[
                            { key: 'all',         label: d.tabAll },
                            { key: 'pending',     label: d.tabPending },
                            { key: 'in-progress', label: d.tabInProgress },
                            { key: 'completed',   label: d.tabCompleted },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, background: activeTab === tab.key ? '#166534' : 'transparent', color: activeTab === tab.key ? 'white' : '#6B7280', transition: 'all 0.15s ease' }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </span>
                        <input type="text" placeholder={d.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '11px 16px 11px 42px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', background: 'white', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} style={{ padding: '11px 40px 11px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', minWidth: 160, appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                        <option value="all">{d.timeAll}</option>
                        <option value="week">{d.timeWeek}</option>
                        <option value="month">{d.timeMonth}</option>
                        <option value="year">{d.timeYear}</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filteredApplications.length === 0 ? (
                            <EmptyState onApply={() => navigate('/apply/birth-certificate')} d={d} />
                        ) : (
                            filteredApplications.map(app => {
                                const badge   = getStatusBadge(app.status, st);
                                const dateStr = app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : '—';
                                const subtitle = app.child_name_bn
                                    ? `Application for birth certificate — ${app.child_name_bn}`
                                    : app.service_type === 'birth_certificate' ? 'Application for birth certificate'
                                    : app.service_type ?? 'Application';

                                return (
                                    <div key={app.app_id} style={{ background: 'white', borderRadius: 16, border: app.status === 'rejected' ? '1.5px solid #FECACA' : '1.5px solid #e5e7eb', padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.18s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                                                    {app.service_type === 'passport' ? (d.servicePassport ?? 'Passport Application') : 'Birth Certificate Application'}
                                                </span>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: badge.bg, color: badge.text, border: `1.5px solid ${badge.border}`, borderRadius: 999, padding: '4px 14px', fontSize: 13, fontWeight: 600 }}>
                                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: badge.dot, flexShrink: 0 }} />
                                                    {badge.label}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'monospace', fontWeight: 500, whiteSpace: 'nowrap' }}>{app.tracking_id ?? '—'}</span>
                                        </div>

                                        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 }}>{subtitle}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                                            {[
                                                { svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" /></svg>, text: d.deptCivil ?? 'Civil Registration' },
                                                { svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#6B7280" strokeWidth="1.6" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" /></svg>, text: app.department ?? (d.deptLocal ?? 'Local Government') },
                                                { svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="1.6" /><path d="M16 2v4M8 2v4M3 10h18" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" /></svg>, text: dateStr },
                                            ].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>{item.svg}<span>{item.text}</span></div>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <button onClick={() => navigate(`/applications/${app.app_id}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', border: '1.5px solid #d1d5db', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                                                    {d.btnDetails ?? 'বিস্তারিত দেখুন'}
                                                </button>

                                                {app.status === 'pending' && (
                                                    <button onClick={() => navigate(`/payment/${app.app_id}`, { state: { appId: app.app_id, trackingId: app.tracking_id, fee: app.fee_amount, serviceType: 'Birth Certificate' } })} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none', borderRadius: 10, background: '#166534', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white', boxShadow: '0 2px 8px rgba(22,101,52,0.20)' }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.7" /><path d="M2 10h20" stroke="white" strokeWidth="1.7" /></svg>
                                                        {d.btnPay ?? 'Pay Now'}
                                                    </button>
                                                )}

                                                {app.status === 'processing' && (
                                                    <button onClick={() => navigate(`/track/${app.app_id}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none', borderRadius: 10, background: '#1D4ED8', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white' }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.7" /><path d="M12 8v4l2.5 2.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" /></svg>
                                                        {d.btnTrack ?? 'Track Status'}
                                                    </button>
                                                )}

                                                {app.status === 'completed' && (
                                                    <button onClick={() => navigate(`/download/${app.app_id}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none', borderRadius: 10, background: '#166534', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white' }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.7" strokeLinecap="round" /><polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="1.7" strokeLinecap="round" /><line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="1.7" strokeLinecap="round" /></svg>
                                                        {d.btnDownload ?? 'Download'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* ✅ Rejection reason + Delete + Reapply */}
                                            {app.status === 'rejected' && (
                                                <div style={{ width: '100%', marginTop: 8 }}>
                                                    {app.rejection_reason && (
                                                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 12, fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>
                                                            <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ বাতিলের কারণ:</div>
                                                            <div>{app.rejection_reason}</div>
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                        {/* ✅ Delete Button */}
                                                        <button
                                                            onClick={() => setDeleteTarget(app)}
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', border: '1.5px solid #FECACA', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#DC2626' }}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                            </svg>
                                                            মুছে ফেলুন
                                                        </button>
                                                        {/* Reapply Button */}
                                                        <button
                                                            onClick={() => navigate('/apply/birth-certificate')}
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', border: 'none', borderRadius: 10, background: '#DC2626', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white', boxShadow: '0 2px 8px rgba(220,38,38,0.25)' }}
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                                                <path d="M1 4v6h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M3.51 15a9 9 0 1 0 .49-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            পুনরায় আবেদন করুন
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CitizenDashboard;
