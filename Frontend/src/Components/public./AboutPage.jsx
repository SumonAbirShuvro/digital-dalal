import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, LangSwitcher } from '../../context/LanguageContext';

const T = {
    bn: {
        appName:     'Smart Citizen Service Tracker',
        appSub:      'Bangladesh Digital Services',
        navAbout:    'About SCST',
        navServices: 'Available Services',
        navContact:  'Contact Us',
        navLogin:    'Login / Register',
        heading:     'About Us',
        tagline1:    'Working on behalf of the Government',
        tagline2:    'Serving You with Trust',
        intro:       'আমরা একটি সরকার অনুমোদিত সেবা অংশীদার যা নাগরিকদের জন্য সরকারি নথির আবেদন প্রক্রিয়া সহজ, দ্রুত এবং ঝামেলামুক্ত করতে প্রতিশ্রুতিবদ্ধ।',
        bold:        'আপনার তথ্য। আমাদের দায়িত্ব। সরকার-অনুমোদিত সেবা।',
        whoTitle:    'Who We Are',
        whoText:     'আমরা একটি বিশ্বস্ত সরকার-অনুমোদিত অংশীদার যা নাগরিকদের সরকারের পক্ষে জন্ম সনদ সহ সরকারি নথির জন্য আবেদন করতে সাহায্য করে।',
        whatTitle:   'What We Do',
        whatText:    'আমরা আপনার জন্য সম্পূর্ণ আবেদন প্রক্রিয়া পরিচালনা করি। আপনি শুধু তথ্য এবং একটি ছোট সেবা ফি প্রদান করুন — বাকি আমরা দেখাশোনা করি।',
        missionTitle:'Our Mission',
        missionText: 'সরকারি প্রক্রিয়াগুলো সহজ করে এবং একটি মসৃণ, নির্ভরযোগ্য ও স্বচ্ছ অভিজ্ঞতা প্রদান করে মানুষের ঝামেলা কমানো।',
        bannerTitle: 'Making Government Service Simple for Everyone',
        bannerSub:   'সরকারি নথির আবেদনের জন্য কী করতে হবে, কোথায় যেতে হবে, কী পদক্ষেপ নিতে হবে — অনেকেই জানেন না। তাই আমরা এখানে আছি।',
        bannerBold:  'আমাদের বুঝতে হবে না। আমরা আপনার হয়ে করে দেবো।',
        howTitle:    'How we Work',
        howSub:      'A simple 4-step process to get you work done',
        step1Title:  '1. Provide Information',
        step1Text:   'Share the required details and documents with us',
        step2Title:  '2. We Process',
        step2Text:   'We prepare and submit your application to the government',
        step3Title:  '3. Government handles it',
        step3Text:   'The government reviews and approves your application.',
        step4Title:  '4. You receive it',
        step4Text:   'We collect the certificate and deliver it to you.',
        hotline:     'জরুরি হটলাইন: ৩৩৩, ৯৯৯',
        footerRight: 'Bangladesh Digital Services | @gov.bd',
    },
    en: {
        appName:     'Smart Citizen Service Tracker',
        appSub:      'Bangladesh Digital Services',
        navAbout:    'About SCST',
        navServices: 'Available Services',
        navContact:  'Contact Us',
        navLogin:    'Login / Register',
        heading:     'About Us',
        tagline1:    'Working on behalf of the Government',
        tagline2:    'Serving You with Trust',
        intro:       'We are a government-authorized service partner dedicated to making official documents applications simple, fast, and hassle-free for everyone.',
        bold:        'Your Information. Our Responsibility. Government-Approved Service.',
        whoTitle:    'Who We Are',
        whoText:     'We are a trusted government-authorized partner that helps citizens apply for official documents including birth certificate on behalf of the government.',
        whatTitle:   'What We Do',
        whatText:    'We handle the entire application process for you. You just provide the required information and a small service fee – we take care of the rest.',
        missionTitle:'Our Mission',
        missionText: 'To reduce people\'s hassle by simplifying government processes and delivering a smooth, reliable and transparent experience.',
        bannerTitle: 'Making Government Service Simple for Everyone',
        bannerSub:   'We know that many people don\'t know how, where or what steps to take for official documents application. That\'s why we\'re here.',
        bannerBold:  'We don\'t have to figure it out. We will do it for you.',
        howTitle:    'How we Work',
        howSub:      'A simple 4-step process to get you work done',
        step1Title:  '1. Provide Information',
        step1Text:   'Share the required details and documents with us',
        step2Title:  '2. We Process',
        step2Text:   'We prepare and submit your application to the government',
        step3Title:  '3. Government handles it',
        step3Text:   'The government reviews and approves your application.',
        step4Title:  '4. You receive it',
        step4Text:   'We collect the certificate and deliver it to you.',
        hotline:     'Emergency Hotline: 333, 999',
        footerRight: 'Bangladesh Digital Services | @gov.bd',
    },
};

export default function AboutPage() {
    const navigate  = useNavigate();
    const { lang }  = useLanguage();
    const tt        = T[lang];

    return (
        <div style={s.root}>

            {/* ── Navbar ── */}
            <header style={s.navbar}>
                <div style={{ ...s.navLeft, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    <div style={s.logoBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3h18v18H3z" stroke="white" strokeWidth="1.5" fill="none"/>
                            <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div>
                        <div style={s.appName}>{tt.appName}</div>
                        <div style={s.appSub}>{tt.appSub}</div>
                    </div>
                </div>
                <nav style={s.navLinks}>
                    <button onClick={() => navigate('/home')} title="Home" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 6 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </button>
                    <LangSwitcher />
                    <Link to="/about"    style={{ ...s.navLink, ...s.navLinkActive }}>{tt.navAbout}</Link>
                    <Link to="/services" style={s.navLink}>{tt.navServices}</Link>
                    <Link to="/contact"  style={s.navLink}>{tt.navContact}</Link>
                    <button style={s.loginBtn} onClick={() => navigate('/login')}>{tt.navLogin}</button>
                </nav>
            </header>

            <main style={{ flex: 1 }}>

                {/* ── Hero Section ── */}
                <div style={s.hero}>
                    <h1 style={s.heroHeading}>{tt.heading}</h1>
                    <p style={s.heroTagline1}>{tt.tagline1}</p>
                    <p style={s.heroTagline2}>{tt.tagline2}</p>
                    <p style={s.heroIntro}>{tt.intro}</p>
                    <p style={s.heroBold}>{tt.bold}</p>
                </div>

                {/* ── 3 Info Cards ── */}
                <div style={s.cardsSection}>
                    {[
                        {
                            title: tt.whoTitle, text: tt.whoText,
                            icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1d6b4f" strokeWidth="1.6" strokeLinecap="round">
                                <circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="1" fill="#1d6b4f"/>
                            </svg>
                        },
                        {
                            title: tt.whatTitle, text: tt.whatText,
                            icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1d6b4f" strokeWidth="1.6" strokeLinecap="round">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M9 9h6M9 12h6M9 15h4"/>
                                <circle cx="18" cy="6" r="3" fill="#22c55e" stroke="none"/>
                                <path d="M16.5 6l1 1 2-2" stroke="white" strokeWidth="1.2"/>
                            </svg>
                        },
                        {
                            title: tt.missionTitle, text: tt.missionText,
                            icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1d6b4f" strokeWidth="1.6" strokeLinecap="round">
                                <circle cx="12" cy="12" r="9"/>
                                <circle cx="12" cy="12" r="5"/>
                                <circle cx="12" cy="12" r="1" fill="#1d6b4f"/>
                                <path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
                            </svg>
                        },
                    ].map((item, i) => (
                        <div key={i} style={s.infoCard}>
                            <div style={s.infoCardIcon}>{item.icon}</div>
                            <div style={s.infoCardTitle}>{item.title}</div>
                            <div style={s.infoCardText}>{item.text}</div>
                        </div>
                    ))}
                </div>

                {/* ── Banner ── */}
                <div style={s.banner}>
                    <div style={s.bannerLeft}>
                        <div style={s.bannerIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                                <rect x="6" y="14" width="4" height="4" rx="0.5" fill="#1d4ed8" stroke="none"/>
                                <rect x="14" y="14" width="4" height="4" rx="0.5" fill="#1d4ed8" stroke="none"/>
                            </svg>
                        </div>
                        <div>
                            <div style={s.bannerTitle}>{tt.bannerTitle}</div>
                            <div style={s.bannerSub2} dangerouslySetInnerHTML={{ __html: tt.bannerTitle.includes('Simple') ? '<span style="color:#22c55e">Simple for Everyone</span>' : '' }} />
                        </div>
                    </div>
                    <div style={s.bannerRight}>
                        <p style={{ margin: "0 0 12px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{tt.bannerSub}</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>{tt.bannerBold}</p>
                    </div>
                </div>

                {/* ── How We Work ── */}
                <div style={s.howSection}>
                    <h2 style={s.howTitle}>{tt.howTitle}</h2>
                    <p style={s.howSub}>{tt.howSub}</p>
                    <div style={s.stepsRow}>
                        {[
                            {
                                title: tt.step1Title, text: tt.step1Text,
                                icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <path d="M9 13h6M9 17h4"/>
                                </svg>
                            },
                            {
                                title: tt.step2Title, text: tt.step2Text,
                                icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="M12 8v4l3 3"/>
                                    <circle cx="19" cy="5" r="3" fill="#22c55e" stroke="none"/>
                                    <path d="M17.5 5l1 1 2-2" stroke="white" strokeWidth="1.2"/>
                                </svg>
                            },
                            {
                                title: tt.step3Title, text: tt.step3Text,
                                icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                            },
                            {
                                title: tt.step4Title, text: tt.step4Text,
                                icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="M8 12l3 3 5-5"/>
                                </svg>
                            },
                        ].map((step, i) => (
                            <div key={i} style={s.stepCard}>
                                <div style={s.stepIcon}>{step.icon}</div>
                                <div style={s.stepTitle}>{step.title}</div>
                                <div style={s.stepText}>{step.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer style={s.footer}>
                <span>{tt.hotline}</span>
                <div style={{ display: 'flex', gap: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#777"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#777"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                </div>
                <span style={{ color: '#888' }}>{tt.footerRight}</span>
            </footer>
        </div>
    );
}

const s = {
    root: { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI','Noto Sans Bengali',system-ui,sans-serif", background: '#f5f5f0' },

    /* Navbar */
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '10px 28px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    navLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    logoBox: { width: 34, height: 34, background: '#166534', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    appName: { fontWeight: 700, fontSize: 15, color: '#111' },
    appSub: { fontSize: 11, color: '#888' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 6 },
    navLink: { padding: '6px 12px', color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
    navLinkActive: { color: '#166534', textDecoration: 'underline', fontWeight: 600 },
    loginBtn: { marginLeft: 8, padding: '8px 18px', background: '#166534', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

    /* Hero */
    hero: { background: '#e8f0e8', padding: '36px 60px 32px' },
    heroHeading: { fontSize: 36, fontWeight: 900, color: '#111', margin: '0 0 8px' },
    heroTagline1: { fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 4px' },
    heroTagline2: { fontSize: 20, fontWeight: 700, color: '#166534', margin: '0 0 16px' },
    heroIntro: { fontSize: 14, color: '#374151', lineHeight: 1.7, maxWidth: 640, margin: '0 0 10px' },
    heroBold: { fontSize: 14, fontWeight: 700, color: '#111', margin: 0 },

    /* Info Cards */
    cardsSection: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, background: '#c8d8c8', padding: '0' },
    infoCard: { background: '#c8d8c8', padding: '28px 28px', borderRight: '1px solid #b0c4b0' },
    infoCardIcon: { marginBottom: 12 },
    infoCardTitle: { fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 8 },
    infoCardText: { fontSize: 13, color: '#374151', lineHeight: 1.7 },

    /* Banner */
    banner: { background: '#fefce8', border: '1px solid #fde68a', margin: '28px 40px', borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 28 },
    bannerLeft: { display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, flexShrink: 0 },
    bannerIcon: { width: 60, height: 60, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    bannerTitle: { fontSize: 16, fontWeight: 800, color: '#111', lineHeight: 1.4 },
    bannerSub2: { fontSize: 16, fontWeight: 800, color: '#22c55e' },
    bannerRight: { flex: 1, borderLeft: '2px solid #fde68a', paddingLeft: 28 },

    /* How we work */
    howSection: { padding: '40px 60px 48px', textAlign: 'center' },
    howTitle: { fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 },
    howSub: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
    stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 },
    stepCard: { background: 'white', borderRadius: 14, padding: '24px 18px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
    stepIcon: { display: 'flex', justifyContent: 'center', marginBottom: 14 },
    stepTitle: { fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 },
    stepText: { fontSize: 13, color: '#6b7280', lineHeight: 1.6 },

    /* Footer */
    footer: { background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#555' },
};
