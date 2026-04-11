import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const T = {
    bn: {
        appName:     'Smart Citizen Service Tracker',
        appSub:      'Bangladesh Digital Services',
        navAbout:    'About SCST',
        navServices: 'Available Services',
        navContact:  'Contact Us',
        navLogin:    'Login / Register',
        title:       'জন্ম নিবন্ধন (Birth Registration)',
        desc:        'নতুন জন্ম নিবন্ধনের জন্য আবেদন করুন অথবা বিদ্যমান তথ্যের সংশোধন করুন।\n(Apply for a new Birth Registration or request corrections.)',
        applyBtn:    'আবেদন করুন (Apply Now)',
        hotline:     'জরুরি হটলাইন: ৩৩৩, ৯৯৯',
        footerRight: 'Bangladesh Digital Services | @gov.bd',
        backHome:    '← হোমপেজে ফিরুন',
    },
    en: {
        appName:     'Smart Citizen Service Tracker',
        appSub:      'Bangladesh Digital Services',
        navAbout:    'About SCST',
        navServices: 'Available Services',
        navContact:  'Contact Us',
        navLogin:    'Login / Register',
        title:       'Birth Registration',
        desc:        'Apply for a new Birth Registration or request corrections to existing records.',
        applyBtn:    'Apply Now',
        hotline:     'Emergency Hotline: 333, 999',
        footerRight: 'Bangladesh Digital Services | @gov.bd',
        backHome:    '← Back to Home',
    },
};

const CertIcon = () => (
    <svg width="80" height="90" viewBox="0 0 64 72" fill="none">
        <rect x="6" y="2" width="44" height="58" rx="4" fill="#fef9ef" stroke="#c9a84c" strokeWidth="2"/>
        <rect x="12" y="14" width="32" height="3" rx="1.5" fill="#c9a84c" opacity="0.6"/>
        <rect x="12" y="21" width="26" height="2" rx="1" fill="#c9a84c" opacity="0.4"/>
        <rect x="12" y="27" width="20" height="2" rx="1" fill="#c9a84c" opacity="0.4"/>
        <circle cx="28" cy="51" r="9" fill="#fef9ef" stroke="#c9a84c" strokeWidth="1.5"/>
        <path d="M24 51l3 3 5-5" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function AvailableServicesPage() {
    const navigate  = useNavigate();
    const { lang }  = useLanguage();
    const t         = T[lang];

    return (
        <div style={s.root}>

            {/* Navbar */}
            <header style={s.navbar}>
                <div style={{ ...s.navLeft, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    <div style={s.logoBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                    <Link to="/services" style={{ ...s.navLink, ...s.navLinkActive }}>{t.navServices}</Link>
                    <Link to="/contact"  style={s.navLink}>{t.navContact}</Link>
                    <button style={s.loginBtn} onClick={() => navigate('/login')}>{t.navLogin}</button>
                </nav>
            </header>

            {/* Content */}
            <main style={s.main}>
                <div style={s.card}>
                    <div style={s.cardIcon}><CertIcon /></div>
                    <h2 style={s.cardTitle}>{t.title}</h2>
                    <p style={s.cardDesc}>
                        {t.desc.split('\n').map((line, i) => (
                            <span key={i}>{line}{i === 0 && <br/>}</span>
                        ))}
                    </p>
                    <button style={s.applyBtn} onClick={() => navigate('/login')}>
                        {t.applyBtn}
                    </button>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <span onClick={() => navigate('/home')} style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>← {t.backHome ?? 'Back to Home'}</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={s.footer}>
                <span>{t.hotline}</span>
                <div style={{ display: 'flex', gap: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#777"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                </div>
                <span style={{ color: '#888' }}>{t.footerRight}</span>
            </footer>
        </div>
    );
}

const s = {
    root: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI','Noto Sans Bengali',system-ui,sans-serif", background: '#f5f5f0' },
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '10px 28px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    navLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    logoBox: { width: 34, height: 34, background: '#166534', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    appName: { fontWeight: 700, fontSize: 15, color: '#111' },
    appSub: { fontSize: 11, color: '#888' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 6 },
    navLink: { padding: '6px 12px', color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
    navLinkActive: { color: '#166534', textDecoration: 'underline', fontWeight: 600 },
    loginBtn: { marginLeft: 8, padding: '8px 18px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
    card: { background: 'white', borderRadius: 20, padding: '48px 52px', textAlign: 'center', maxWidth: 480, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' },
    cardIcon: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 14, lineHeight: 1.3 },
    cardDesc: { fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 28 },
    applyBtn: { padding: '14px 0', width: '100%', background: '#166534', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
    footer: { background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#555' },
};
