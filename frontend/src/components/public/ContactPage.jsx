import { useState } from 'react';
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
        heading:     'Contact Us:',
        name:        'Name:',
        emailPhone:  'Email/Phone:',
        trackingId:  'Tracking ID:',
        message:     'Message:',
        submit:      'Submit',
        submitting:  'Submitting...',
        success:     '✅ আপনার বার্তা পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।',
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
        heading:     'Contact Us:',
        name:        'Name:',
        emailPhone:  'Email/Phone:',
        trackingId:  'Tracking ID:',
        message:     'Message:',
        submit:      'Submit',
        submitting:  'Submitting...',
        success:     '✅ Your message has been sent. We will contact you soon.',
        hotline:     'Emergency Hotline: 333, 999',
        footerRight: 'Bangladesh Digital Services | @gov.bd',
        backHome:    '← Back to Home',
    },
};

export default function ContactPage() {
    const navigate  = useNavigate();
    const { lang }  = useLanguage();
    const t         = T[lang];

    const [form, setForm]         = useState({ name: '', emailPhone: '', trackingId: '', message: '' });
    const [loading, setLoading]   = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
    };

    return (
        <div style={s.root}>

            {/* Navbar */}
            <header style={s.navbar}>
                <div style={{ ...s.navLeft, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    <div style={s.logoBox}>
                        <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" style={{borderRadius:3,boxShadow:'0 1px 4px rgba(0,0,0,0.18)'}}>
                            <rect width="28" height="20" fill="#006A4E"/>
                            <circle cx="13" cy="10" r="6" fill="#F42A41"/>
                        </svg>
                    </div>
                    <div>
                        <div style={s.appName}>{t.appName}</div>
                        <div style={s.appSub}>{t.appSub}</div>
                    </div>
                </div>
                <nav style={s.navLinks}>
                    <button onClick={() => navigate('/home')} title="Home" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 6 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </button>
                    <Link to="/about"    style={s.navLink}>{t.navAbout}</Link>
                    <Link to="/services" style={s.navLink}>{t.navServices}</Link>
                    <Link to="/contact"  style={{ ...s.navLink, ...s.navLinkActive }}>{t.navContact}</Link>
                    <button style={s.loginBtn} onClick={() => navigate('/login')}>{t.navLogin}</button>
                </nav>
            </header>

            {/* Content */}
            <main style={s.main}>
                <div style={s.formWrap}>
                    <div style={s.formHeader}>
                        <h2 style={s.formTitle}>{t.heading}</h2>
                    </div>

                    {submitted ? (
                        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
                            <div style={{ fontSize: 16, color: '#166534', fontWeight: 600, marginBottom: 16 }}>{t.success}</div>
                            <span onClick={() => navigate('/home')} style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>← {t.backHome ?? 'Back to Home'}</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={s.form}>
                            <div style={s.field}>
                                <label style={s.label}>{t.name}</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    style={s.input}
                                    required
                                />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>{t.emailPhone}</label>
                                <input
                                    name="emailPhone"
                                    value={form.emailPhone}
                                    onChange={handleChange}
                                    style={s.input}
                                    required
                                />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>{t.trackingId}</label>
                                <input
                                    name="trackingId"
                                    value={form.trackingId}
                                    onChange={handleChange}
                                    style={s.input}
                                />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>{t.message}</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={4}
                                    style={{ ...s.input, resize: 'vertical', height: 90 }}
                                    required
                                />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 8 }}>
                                <button type="submit" style={s.submitBtn} disabled={loading}>
                                    {loading ? t.submitting : t.submit}
                                </button>
                            </div>
                        </form>
                    )}
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
    root: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI','Noto Sans Bengali',system-ui,sans-serif", background: '#f9f9f9' },
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '10px clamp(12px, 3vw, 28px)', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    navLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    logoBox: { width: 34, height: 34, background: '#166534', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    appName: { fontWeight: 700, fontSize: 15, color: '#111' },
    appSub: { fontSize: 11, color: '#888' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 6 },
    navLink: { padding: '6px 12px', color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
    navLinkActive: { color: '#166534', textDecoration: 'underline', fontWeight: 600 },
    loginBtn: { marginLeft: 8, padding: '8px 18px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    main: { flex: 1, display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 40px) clamp(12px, 2vw, 20px)' },
    formWrap: { background: 'white', borderRadius: 12, width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    formHeader: { background: '#e53935', padding: '18px 28px' },
    formTitle: { color: 'white', fontSize: 22, fontWeight: 800, margin: 0 },
    form: { padding: '28px 28px 32px' },
    field: { marginBottom: 18 },
    label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#222', marginBottom: 6 },
    input: { width: '100%', background: '#e8e8e8', border: 'none', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#333', outline: 'none', boxSizing: 'border-box' },
    submitBtn: { padding: '12px 48px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
    footer: { background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#555' },
};
