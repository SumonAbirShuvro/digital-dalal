import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, LangSwitcher } from '../../context/LanguageContext';

const T = {
    bn: {
        appName:       'Smart Citizen Service Tracker',
        appSub:        'Bangladesh Digital Services',
        navAbout:      'About SCST',
        navServices:   'Available Services',
        navContact:    'Contact Us',
        navLoginBtn:   'লগইন',
        navRegisterBtn:'রেজিস্টার',
        hero:          'এক ঠিকানায় সকল সরকারি সেবা (All Govt. Services in One Place)',
        searchPh:      'আপনি কোন সেবা খুঁজছেন? যেমন: পাসপোর্ট বা জন্ম নিবন্ধন',
        quickCards:    'কুইক সার্ভিস কার্ডস',
        birthCert:     'জন্ম নিবন্ধন',
        quickTrack:    'কুইক ট্র্যাকিং (Quick Tracking)',
        trackPh:       'আপনার ১২ ডিজিটের ট্র্যাকিং আইডি দিন',
        trackBtn:      'Track Now',
        tracking:      'Tracking...',
        hotline:       'জরুরি হটলাইন: ৩৩৩, ৯৯৯',
        footerRight:   'Bangladesh Digital Services | @gov.bd',
        /* tracking result */
        trTitle:       'জন্ম নিবন্ধন',
        trStep1:       'আবেদন জমা দেওয়া হয়েছে',
        trStep2:       'যাচাইকরণ',
        trStep3:       'অনুমোদন',
        trStep4:       'ডেলিভারি',
        trAppId:       'আবেদন আইডি',
        trCurrent:     'বর্তমান অবস্থা',
        trExpected:    'প্রত্যাশিত ডেলিভারি',
        trNote:        'অতিরিক্ত তথ্য প্রয়োজন হতে পারে',
        trStatus:      'অনুমোদন প্রক্রিয়াধীন',
        trDate:        '১০ মে ২০২৬',
        trNotFound:    'ট্র্যাকিং আইডি পাওয়া যায়নি। সঠিক আইডি দিন।',
    },
    en: {
        appName:       'Smart Citizen Service Tracker',
        appSub:        'Bangladesh Digital Services',
        navAbout:      'About SCST',
        navServices:   'Available Services',
        navContact:    'Contact Us',
        navLoginBtn:   'Login',
        navRegisterBtn:'Register',
        hero:          'All Govt. Services in One Place',
        searchPh:      'What service are you looking for? e.g. Passport or Birth Registration',
        quickCards:    'Quick Service Cards',
        birthCert:     'Birth Registration',
        quickTrack:    'Quick Tracking',
        trackPh:       'Enter your 12-digit tracking ID',
        trackBtn:      'Track Now',
        tracking:      'Tracking...',
        hotline:       'Emergency Hotline: 333, 999',
        footerRight:   'Bangladesh Digital Services | @gov.bd',
        trTitle:       'Birth Registration',
        trStep1:       'Application Submitted',
        trStep2:       'Verification',
        trStep3:       'Approval',
        trStep4:       'Delivery',
        trAppId:       'Application ID',
        trCurrent:     'Current Status',
        trExpected:    'Expected Delivery',
        trNote:        'Additional info may be required',
        trStatus:      'Approval in Progress',
        trDate:        '10 May 2026',
        trNotFound:    'Tracking ID not found. Please enter a valid ID.',
    },
};

/* ── Certificate SVG ── */
const CertIcon = ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect x="8" y="4" width="40" height="52" rx="4" fill="#fef9ef" stroke="#c9a84c" strokeWidth="2"/>
        <rect x="14" y="16" width="28" height="3" rx="1.5" fill="#c9a84c" opacity="0.6"/>
        <rect x="14" y="23" width="22" height="2" rx="1" fill="#c9a84c" opacity="0.4"/>
        <rect x="14" y="29" width="18" height="2" rx="1" fill="#c9a84c" opacity="0.4"/>
        <circle cx="32" cy="46" r="8" fill="#fef9ef" stroke="#c9a84c" strokeWidth="1.5"/>
        <path d="M28 46l3 3 5-5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function HomePage() {
    const navigate     = useNavigate();
    const { lang }     = useLanguage();
    const t            = T[lang];

    const [trackId, setTrackId]         = useState('');
    const [trackResult, setTrackResult] = useState(null); // null | 'found' | 'notfound'
    const [tracking, setTracking]       = useState(false);

    const handleTrack = () => {
        if (!trackId.trim()) return;
        setTracking(true);
        setTimeout(() => {
            setTracking(false);
            setTrackResult(trackId.trim().length >= 6 ? 'found' : 'notfound');
        }, 900);
    };

    return (
        <div style={s.root}>

            {/* ══ Navbar ══ */}
            <header style={s.navbar}>
                <div style={s.navLeft}>
                    <div style={s.logoBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h18v18H3z" stroke="white" strokeWidth="1.5" fill="none"/>
                            <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div>
                        <div style={s.appName}>{t.appName}</div>
                        <div style={s.appSub}>{t.appSub}</div>
                    </div>
                </div>

                <nav style={s.navLinks}>
                    <Link to="/about"    style={s.navLink}>{t.navAbout}</Link>
                    <Link to="/services" style={s.navLink}>{t.navServices}</Link>
                    <Link to="/contact"  style={s.navLink}>{t.navContact}</Link>
                    <LangSwitcher />
                    <button
                        style={{ ...s.loginBtn, background: 'transparent', border: '1.5px solid #166534', color: '#166534', marginLeft: 4 }}
                        onClick={() => navigate('/register')}
                    >
                        {t.navRegisterBtn}
                    </button>
                    <button style={s.loginBtn} onClick={() => navigate('/login')}>
                        {t.navLoginBtn}
                    </button>
                </nav>
            </header>

            {/* ══ Hero ══ */}
            <div style={s.hero}>
                <h1 style={s.heroTitle}>{t.hero}</h1>
                <div style={s.searchBox}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#9ca3af', flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <input style={s.searchInput} placeholder={t.searchPh} />
                </div>
            </div>

            {/* ══ Main Content ══ */}
            <main style={s.main}>

                {/* Quick Service Cards — centered */}
                <div style={{ textAlign: 'center', marginBottom: 0 }}>
                    <div style={s.sectionTitle}>{t.quickCards}</div>
                </div>
                <div style={s.cardsRow}>
                    <div style={s.serviceCard} onClick={() => navigate('/login')}>
                        <CertIcon size={52} />
                        <div style={s.serviceCardLabel}>{t.birthCert}</div>
                    </div>
                </div>

                {/* Quick Tracking */}
                <div style={{ ...s.sectionTitle, marginTop: 32 }}>{t.quickTrack}</div>
                <div style={s.trackRow}>
                    <input
                        style={s.trackInput}
                        placeholder={t.trackPh}
                        value={trackId}
                        onChange={e => { setTrackId(e.target.value); setTrackResult(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleTrack()}
                    />
                    <button style={s.trackBtn} onClick={handleTrack} disabled={tracking}>
                        {tracking ? (
                            <span style={{ display:'flex', alignItems:'center', gap: 6 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="28 56"/>
                                </svg>
                                {t.tracking}
                            </span>
                        ) : (
                            <span style={{ display:'flex', alignItems:'center', gap: 6 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                                </svg>
                                {t.trackBtn}
                            </span>
                        )}
                    </button>
                </div>

                {/* Not found */}
                {trackResult === 'notfound' && (
                    <div style={{ marginTop: 10, color: '#dc2626', fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
                        ⚠️ {t.trNotFound}
                    </div>
                )}

                {/* ✅ Tracking Result Panel — image 1 এর মতো */}
                {trackResult === 'found' && (
                    <div style={s.trackPanel}>
                        {/* Panel header */}
                        <div style={s.trackPanelHeader}>
                            <CertIcon size={48} />
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginLeft: 14 }}>
                                {t.trTitle}
                            </div>
                        </div>

                        {/* Timeline — image 1 এর মতো */}
                        <div style={s.timeline}>
                            {[
                                { label: t.trStep1, done: true,  active: false },
                                { label: t.trStep2, done: true,  active: false },
                                { label: t.trStep3, done: false, active: true  },
                                { label: t.trStep4, done: false, active: false },
                            ].map((step, i) => (
                                <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Line before dot */}
                                    {i > 0 && (
                                        <div style={{
                                            position: 'absolute', top: 9, right: '50%', width: '100%',
                                            height: 2,
                                            background: step.done || step.active ? '#166534' : '#e5e7eb',
                                        }}/>
                                    )}
                                    {/* Dot */}
                                    <div style={{
                                        width: step.active ? 20 : 16,
                                        height: step.active ? 20 : 16,
                                        borderRadius: '50%',
                                        background: step.done ? '#166534' : step.active ? 'white' : '#e5e7eb',
                                        border: step.active ? '3px solid #166534' : 'none',
                                        zIndex: 1, flexShrink: 0,
                                        boxShadow: step.active ? '0 0 0 3px #dcfce7' : 'none',
                                    }}/>
                                    {/* Label */}
                                    <div style={{
                                        fontSize: 12, marginTop: 8, textAlign: 'center',
                                        color: step.done || step.active ? '#166534' : '#9ca3af',
                                        fontWeight: step.active ? 700 : 400,
                                    }}>
                                        {step.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Details Grid — image 1 এর মতো */}
                        <div style={s.trackDetails}>
                            <div style={s.trackDetailItem}>
                                <div style={s.trackDetailLabel}>{t.trAppId}</div>
                                <div style={s.trackDetailVal}>{trackId}</div>
                            </div>
                            <div style={s.trackDetailItem}>
                                <div style={s.trackDetailLabel}>{t.trCurrent}</div>
                                <div style={{ ...s.trackDetailVal, color: '#166534' }}>{t.trStatus}</div>
                            </div>
                            <div style={s.trackDetailItem}>
                                <div style={s.trackDetailLabel}>{t.trExpected}</div>
                                <div style={s.trackDetailVal}>{t.trDate}</div>
                            </div>
                            <div style={s.trackDetailItem}>
                                <div style={s.trackDetailLabel}>{lang === 'bn' ? 'ডেলিভারি' : 'Delivery'}</div>
                                <div style={{ ...s.trackDetailVal, color: '#6b7280', fontSize: 12 }}>{t.trNote}</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ══ Feedback Button ══ */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 8px' }}>
                <button
                    onClick={() => navigate('/feedback')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'linear-gradient(135deg,#166534,#15803d)',
                        color: 'white', border: 'none',
                        borderRadius: 50, padding: '14px 28px',
                        fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(22,101,52,0.3)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(22,101,52,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(22,101,52,0.3)'; }}
                >
                    {t.feedbackBtn}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* ══ Footer ══ */}
            <footer style={s.footer}>
                <span style={s.footerLeft}>{t.hotline}</span>
                <div style={s.footerIcons}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#555"/></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                </div>
                <span style={s.footerRight}>{t.footerRight}</span>
            </footer>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

const s = {
    root: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI','Noto Sans Bengali',system-ui,sans-serif", background: '#f5f5f0' },

    /* Navbar */
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '10px 28px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    navLeft: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
    logoBox: { width: 36, height: 36, background: '#166534', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    appName: { fontWeight: 700, fontSize: 15, color: '#111', lineHeight: 1.2 },
    appSub: { fontSize: 11, color: '#888' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 4 },
    navLink: { padding: '6px 12px', color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 6 },
    loginBtn: { marginLeft: 4, padding: '8px 18px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

    /* Hero */
    hero: { background: 'linear-gradient(135deg, #d4e8d4 0%, #e8ede4 60%, #f0ece0 100%)', padding: '40px 60px 32px' },
    heroTitle: { fontSize: 26, fontWeight: 800, color: '#166534', marginBottom: 20, lineHeight: 1.4 },
    searchBox: { display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 10, padding: '12px 16px', maxWidth: 560, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
    searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent' },

    /* Main */
    main: { flex: 1, padding: '28px 60px 40px' },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 },

    /* Service Card */
    cardsRow: { display: 'flex', gap: 14, justifyContent: 'center' },
    serviceCard: { background: 'white', borderRadius: 14, padding: '20px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', border: '1.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.15s', minWidth: 130 },
    serviceCardLabel: { fontSize: 15, fontWeight: 700, color: '#111', textAlign: 'center' },

    /* Tracking */
    trackRow: { display: 'flex', gap: 10, maxWidth: 680 },
    trackInput: { flex: 1, border: '1.5px solid #d1d5db', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', color: '#374151', background: 'white' },
    trackBtn: { padding: '12px 22px', background: '#166534', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },

    /* Tracking Panel */
    trackPanel: { marginTop: 20, background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: '24px 28px', maxWidth: 680, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    trackPanelHeader: { display: 'flex', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' },
    timeline: { display: 'flex', alignItems: 'flex-start', marginBottom: 24 },
    trackDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    trackDetailItem: { background: '#f9fafb', borderRadius: 10, padding: '12px 14px' },
    trackDetailLabel: { fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 4 },
    trackDetailVal: { fontSize: 14, fontWeight: 600, color: '#111' },

    /* Footer */
    footer: { background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#555' },
    footerLeft: { fontWeight: 500 },
    footerIcons: { display: 'flex', gap: 14, alignItems: 'center' },
    footerRight: { color: '#888' },
};
