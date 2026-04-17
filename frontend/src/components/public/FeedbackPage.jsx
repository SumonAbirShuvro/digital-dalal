import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LangSwitcher } from '../../context/LanguageContext';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import api from '../../services/api';

const T = {
    bn: {
        appName:       'Smart Citizen Service Tracker',
        appSub:        'Bangladesh Digital Services',
        pageTitle:     'মতামত ও অভিযোগ',
        pageSub:       'আপনার মূল্যবান মতামত বা অভিযোগ জানান',
        typeFeedback:  '💬 মতামত (Feedback)',
        typeComplaint: '⚠️ অভিযোগ (Complaint)',
        catLabel:      'বিভাগ',
        catOptions:    ['সেবার মান', 'পেমেন্ট সমস্যা', 'আবেদন প্রক্রিয়া', 'ওয়েবসাইট সমস্যা', 'অফিসার ব্যবহার', 'অন্যান্য'],
        subjectLabel:  'বিষয়',
        subjectPh:     'সংক্ষেপে বিষয়টি লিখুন',
        descLabel:     'বিস্তারিত বিবরণ',
        descPh:        'আপনার মতামত বা অভিযোগের বিস্তারিত লিখুন...',
        trackLabel:    'ট্র্যাকিং আইডি (ঐচ্ছিক)',
        trackPh:       'যদি কোনো আবেদন সম্পর্কিত হয়',
        submitBtn:     'জমা দিন',
        submitting:    'জমা হচ্ছে...',
        backBtn:       '← ফিরে যান',
        successTitle:  'জমা হয়েছে! ✅',
        successMsg:    'আপনার মতামত/অভিযোগ সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো।',
        backHome:      'হোমপেজে ফিরুন',
        errSubject:    'বিষয় লিখুন',
        errDesc:       'বিস্তারিত লিখুন',
        charCount:     (n) => `${n} অক্ষর`,
        loginWarning:  'লগইন করুন — আপনার নাম ও তথ্য স্বয়ংক্রিয়ভাবে যুক্ত হবে',
    },
    en: {
        appName:       'Smart Citizen Service Tracker',
        appSub:        'Bangladesh Digital Services',
        pageTitle:     'Feedback & Complaints',
        pageSub:       'Share your valuable feedback or file a complaint',
        typeFeedback:  '💬 Feedback',
        typeComplaint: '⚠️ Complaint',
        catLabel:      'Category',
        catOptions:    ['Service Quality', 'Payment Issue', 'Application Process', 'Website Issue', 'Officer Behavior', 'Other'],
        subjectLabel:  'Subject',
        subjectPh:     'Write a brief subject',
        descLabel:     'Description',
        descPh:        'Describe your feedback or complaint in detail...',
        trackLabel:    'Tracking ID (Optional)',
        trackPh:       'If related to an application',
        submitBtn:     'Submit',
        submitting:    'Submitting...',
        backBtn:       '← Go Back',
        successTitle:  'Submitted! ✅',
        successMsg:    'Your feedback/complaint has been submitted. We will contact you soon.',
        backHome:      'Back to Home',
        errSubject:    'Please enter a subject',
        errDesc:       'Please enter a description',
        charCount:     (n) => `${n} characters`,
        loginWarning:  'Login to auto-fill your name and details',
    },
};

export default function FeedbackPage() {
    const navigate  = useNavigate();
    const { lang }  = useLanguage();
    const tt        = T[lang];
    const user      = getUser();

    const [type, setType]               = useState('feedback');
    const [category, setCategory]       = useState('');
    const [subject, setSubject]         = useState('');
    const [description, setDescription] = useState('');
    const [trackingId, setTrackingId]   = useState('');
    const [submitting, setSubmitting]   = useState(false);
    const [submitted, setSubmitted]     = useState(false);
    const [errors, setErrors]           = useState({});

    const validate = () => {
        const e = {};
        if (!subject.trim())     e.subject     = tt.errSubject;
        if (!description.trim()) e.description = tt.errDesc;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await api.post('/feedback', {
                type,
                category: category || tt.catOptions[5],
                subject:  subject.trim(),
                description: description.trim(),
                trackingId: trackingId.trim() || null,
                userId: user?.userId || null,
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setSubmitted(true); 
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={s.root}>

            {/* Navbar */}
            <header style={s.navbar}>
                <div style={s.navLeft} onClick={() => navigate('/home')}>
                    <div style={s.logoBox}>
                        <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" style={{borderRadius:3, boxShadow:'0 1px 4px rgba(0,0,0,0.18)'}}>
                            <rect width="28" height="20" fill="#006A4E"/>
                            <circle cx="13" cy="10" r="6" fill="#F42A41"/>
                        </svg>
                    </div>
                    <div>
                        <div style={s.appName}>{tt.appName}</div>
                        <div style={s.appSub}>{tt.appSub}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <LangSwitcher />
                    <button onClick={() => navigate(-1)} style={s.backBtn}>{tt.backBtn}</button>
                </div>
            </header>

            <main style={s.main}>
                {submitted ? (
                    <div style={s.successCard}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#166534', marginBottom: 12 }}>{tt.successTitle}</div>
                        <div style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>{tt.successMsg}</div>
                        <button onClick={() => navigate('/home')} style={s.submitBtn}>
                            {tt.backHome}
                        </button>
                    </div>
                ) : (
                    <div style={s.formCard}>

                        {/* Header */}
                        <div style={s.formHeader}>
                            <div style={s.headerIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{tt.pageTitle}</div>
                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>{tt.pageSub}</div>
                            </div>
                        </div>

                        {/* Login hint */}
                        {!user && (
                            <div style={{ background: '#fef9ef', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                💡 {tt.loginWarning}
                            </div>
                        )}

                        {/* Type selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                            {['feedback', 'complaint'].map(tp => (
                                <div
                                    key={tp}
                                    onClick={() => setType(tp)}
                                    style={{
                                        padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                                        border: type === tp ? `2px solid ${tp === 'feedback' ? '#166534' : '#dc2626'}` : '1.5px solid #e5e7eb',
                                        background: type === tp ? (tp === 'feedback' ? '#f0fdf4' : '#fef2f2') : 'white',
                                        fontWeight: 700, fontSize: 14,
                                        color: type === tp ? (tp === 'feedback' ? '#166534' : '#dc2626') : '#555',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {tp === 'feedback' ? tt.typeFeedback : tt.typeComplaint}
                                </div>
                            ))}
                        </div>

                        {/* Category */}
                        <div style={s.field}>
                            <label style={s.label}>{tt.catLabel}</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={s.input}>
                                <option value="">— {tt.catLabel} —</option>
                                {tt.catOptions.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject */}
                        <div style={s.field}>
                            <label style={s.label}>{tt.subjectLabel} <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                value={subject}
                                onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: '' })); }}
                                placeholder={tt.subjectPh}
                                style={{ ...s.input, borderColor: errors.subject ? '#ef4444' : '#e5e7eb' }}
                            />
                            {errors.subject && <div style={s.errText}>{errors.subject}</div>}
                        </div>

                        {/* Description */}
                        <div style={s.field}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={{ ...s.label, marginBottom: 0 }}>{tt.descLabel} <span style={{ color: '#ef4444' }}>*</span></label>
                                <span style={{ fontSize: 12, color: '#9ca3af' }}>{tt.charCount(description.length)}</span>
                            </div>
                            <textarea
                                value={description}
                                onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
                                placeholder={tt.descPh}
                                rows={5}
                                style={{ ...s.input, resize: 'vertical', minHeight: 120, borderColor: errors.description ? '#ef4444' : '#e5e7eb' }}
                            />
                            {errors.description && <div style={s.errText}>{errors.description}</div>}
                        </div>

                        {/* Tracking ID */}
                        <div style={s.field}>
                            <label style={s.label}>{tt.trackLabel}</label>
                            <input
                                value={trackingId}
                                onChange={e => setTrackingId(e.target.value)}
                                placeholder={tt.trackPh}
                                style={s.input}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer', marginTop: 8 }}
                        >
                            {submitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="28 56"/>
                                    </svg>
                                    {tt.submitting}
                                </span>
                            ) : tt.submitBtn}
                        </button>

                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={s.footer}>
                <span>জরুরি হটলাইন: ৩৩৩, ৯৯৯</span>
                <span style={{ color: '#888' }}>Bangladesh Digital Services | @gov.bd</span>
            </footer>
        </div>
    );
}


const s = {
    root:        { minHeight: '100vh', background: '#f4f6f4', fontFamily: "'Segoe UI','Inter',sans-serif", display: 'flex', flexDirection: 'column' },
    navbar:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px clamp(12px,3vw,32px)', background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    navLeft:     { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
    logoBox:     { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    appName:     { fontWeight: 700, fontSize: 15, color: '#111' },
    appSub:      { fontSize: 11, color: '#888' },
    backBtn:     { background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' },
    main:        { flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,24px)' },
    formCard:    { background: '#fff', borderRadius: 20, padding: 'clamp(24px,4vw,40px)', width: '100%', maxWidth: 580, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
    successCard: { background: '#fff', borderRadius: 20, padding: 48, width: '100%', maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    formHeader:  { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f3f4f6' },
    headerIcon:  { width: 52, height: 52, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    field:       { marginBottom: 20 },
    label:       { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input:       { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111', outline: 'none', background: '#fafafa', boxSizing: 'border-box', fontFamily: 'inherit' },
    errText:     { fontSize: 12, color: '#ef4444', marginTop: 4 },
    submitBtn:   { width: '100%', padding: '14px', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg,#166534,#15803d)', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,101,52,0.25)' },
    footer:      { display: 'flex', justifyContent: 'space-between', padding: '14px clamp(12px,3vw,32px)', background: '#fff', borderTop: '1px solid #e5e7eb', fontSize: 12, color: '#555', flexWrap: 'wrap', gap: 8 },
};
