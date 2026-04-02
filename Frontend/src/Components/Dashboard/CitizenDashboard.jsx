import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';
import './CitizenDashboard.css'; 

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // এপিআই থেকে ডাটা ফেচ করা হচ্ছে
            const response = await api.get('/citizen/applications');
            
            if (response.success) {
                setApplications(response.data);
                
                // স্ট্যাটাস ক্যালকুলেশন
                const total = response.data.length;
                const pending = response.data.filter(app => app.status === 'pending').length;
                const inProgress = response.data.filter(app => app.status === 'processing').length;
                const completed = response.data.filter(app => app.status === 'completed').length;
                
                setStats({ total, pending, inProgress, completed });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { text: 'পেমেন্ট বাকি', color: 'warning', icon: '⏱️' },
            'processing': { text: 'চলমান', color: 'info', icon: 'ℹ️' },
            'verified': { text: 'যাচাইকৃত', color: 'success', icon: '✓' },
            'approved': { text: 'অনুমোদিত', color: 'success', icon: '✓' },
            'completed': { text: 'সম্পন্ন', color: 'success', icon: '✓' },
            'rejected': { text: 'বাতিল', color: 'danger', icon: '✗' }
        };
        return badges[status] || badges['pending'];
    };

    const filteredApplications = applications.filter(app => {
        if (activeTab !== 'all') {
            if (activeTab === 'pending' && app.status !== 'pending') return false;
            if (activeTab === 'in-progress' && app.status !== 'processing') return false;
            if (activeTab === 'completed' && app.status !== 'completed') return false;
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                app.tracking_id.toLowerCase().includes(query) ||
                app.service_type.toLowerCase().includes(query)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>লোড হচ্ছে...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* হেডার সেকশন */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo-section">
                        <div className="app-logo">
                            <div className="logo-icon">📄</div>
                        </div>
                        <div className="app-title">
                            <h1>স্মার্ট সিটিজেন সার্ভিস ট্র্যাকার</h1>
                            <p>বাংলাদেশ ডিজিটাল সার্ভিস</p>
                        </div>
                    </div>
                </div>
                
                <div className="header-right">
                    <button className="notification-btn">
                        <span className="notif-icon">🔔</span>
                        <span className="notif-badge">1</span>
                    </button>
                    
                    <div className="user-info">
                        <span className="user-icon">👤</span>
                        <span className="user-email">{user?.email || user?.mobile}</span>
                    </div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>🚪</span> লগআউট
                    </button>
                </div>
            </header>

            {/* মেইন কন্টেন্ট */}
            <main className="dashboard-main">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">মোট আবেদন</span>
                            <span className="stat-icon">📄</span>
                        </div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-bar" style={{width: '100%', background: '#000'}}></div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">পেন্ডিং</span>
                            <span className="stat-icon warning">⏱️</span>
                        </div>
                        <div className="stat-value">{stats.pending}</div>
                        <div className="stat-bar" style={{width: `${(stats.pending/stats.total)*100}%`, background: '#fbbf24'}}></div>
                    </div>

                    {/* অন্যান্য স্ট্যাটাস কার্ড এখানে থাকবে... */}
                </div>

                <div className="content-section">
                    <div className="tabs-actions">
                        <div className="tabs">
                            <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>সব আবেদন</button>
                            <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>পেন্ডিং</button>
                        </div>
                        <button className="new-request-btn"><span>➕</span> নতুন আবেদন</button>
                    </div>

                    <div className="search-filter">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="ট্র্যাকিং আইডি বা নাম দিয়ে খুঁজুন"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="applications-list">
                        {filteredApplications.length === 0 ? (
                            <div className="empty-state"><p>কোনো আবেদন পাওয়া যায়নি</p></div>
                        ) : (
                            filteredApplications.map(app => (
                                <div key={app.app_id} className="application-card">
                                    <div className="app-header">
                                        <div className="app-title-section">
                                            <h3>{app.service_type === 'birth_certificate' ? 'জন্ম নিবন্ধন আবেদন' : 'পাসপোর্ট আবেদন'}</h3>
                                            <span className={`status-badge ${getStatusBadge(app.status).color}`}>
                                                {getStatusBadge(app.status).icon} {getStatusBadge(app.status).text}
                                            </span>
                                        </div>
                                        <span className="tracking-id">#{app.tracking_id}</span>
                                    </div>
                                    <div className="app-actions">
                                        <button className="btn-outline">বিস্তারিত দেখুন</button>
                                        {app.status === 'pending' && <button className="btn-primary">পেমেন্ট করুন</button>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CitizenDashboard;