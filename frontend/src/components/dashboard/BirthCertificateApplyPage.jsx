import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { getUser } from '../../utils/auth';

/*    SHARED STYLES*/ 
const inputSt = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, color: '#374151', background: 'white',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const Field = ({ label, required, error, half, children }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2', marginBottom: 4 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
            {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
        </label>
        {children}
        {error && <span style={{ fontSize: 12, color: '#EF4444', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
);


const SuggestInput = ({ value, onChange, placeholder, style, suggestions = [], error }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = suggestions.filter(s => s && s.toLowerCase().includes((value || '').toLowerCase()) && s !== value);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <input
                value={value}
                onChange={e => { onChange(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                style={{ ...style, borderColor: error ? '#EF4444' : (style?.borderColor || '#e5e7eb') }}
            />
            {open && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                    background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', marginTop: 4,
                }}>
                    {filtered.map((s, i) => (
                        <div
                            key={i}
                            onMouseDown={() => { onChange(s); setOpen(false); }}
                            style={{
                                padding: '11px 14px', fontSize: 14, color: '#111827', cursor: 'pointer',
                                borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                                background: 'white',
                                transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


/*    STEP INDICATOR */
const StepBar = ({ current, steps }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {steps.map((s, i) => {
            const active = i + 1 === current;
            const done   = i + 1 < current;
            return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: done || active ? '#166534' : 'white', border: `2px solid ${done || active ? '#166534' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {done
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                : <span style={{ fontSize: 13, fontWeight: 700, color: active ? 'white' : '#9CA3AF' }}>{i + 1}</span>
                            }
                        </div>
                        <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#166534' : done ? '#374151' : '#9CA3AF', whiteSpace: 'nowrap' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? '#166534' : '#e5e7eb', margin: '0 8px', marginBottom: 22 }} />}
                </div>
            );
        })}
    </div>
);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
        <span style={{ fontSize: 13, color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
);

/*   PAGE HEADER */
const PageHeader = ({ b, c }) => {
    const navigate          = useNavigate();
    const user              = getUser();
    const { lang, setLang } = useLanguage();
    const displayName = user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
    const displaySub  = user?.mobile || user?.email || '';

    return (
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>{c.portalName}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{c.portalSub}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#6B7280' }}>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: lang === 'en' ? 700 : 400, color: lang === 'en' ? '#166534' : '#6B7280' }}>{c.english}</button>
                    <span style={{ color: '#d1d5db' }}>/</span>
                    <button onClick={() => setLang('bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: lang === 'bn' ? 700 : 400, color: lang === 'bn' ? '#166534' : '#6B7280' }}>{c.bangla}</button>
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <div style={{ position: 'relative', cursor: 'pointer', color: '#6B7280', display: 'flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }} />
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{displayName}</div>
                        {displaySub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{displaySub}</div>}
                    </div>
                    <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8" /></svg>
                    </div>
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <button onClick={() => navigate('/dashboard')} title={c.backToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
            </div>
        </header>
    );
};

/*    MAIN PAGE */
const BirthCertificateApplyPage = () => {
    const navigate = useNavigate();
    const fileRef  = useRef();

    const { t } = useLanguage();
    const b = t('birthCert');
    const c = t('common');

    const [step, setStep]               = useState(1);
    const [autoFilled, setAutoFilled]   = useState(false);
    const [prevData, setPrevData]         = useState([]);   
    const [busy, setBusy]               = useState(false);
    const [files, setFiles]             = useState([]);
    const [trackingId, setTrackingId]   = useState('');
    const [appId, setAppId]             = useState('');   
    const [submitError, setSubmitError] = useState('');

   
    const [form, setForm] = useState({
        child_name_bn:     '',   
        child_name_en:     '',   
        father_name_bn:    '',   
        mother_name_bn:    '',  
        birth_date:        '',   
        gender:            '',  
        birth_place:       '',  
        district:          '',   
        present_address:   '',   
        permanent_address: '',   
        father_name_en:    '',   
        father_nationality:'',  
        mother_name_en:    '',   
        mother_nationality:'',  
    });

    const [err, setErr] = useState({});
    const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: '' })); };

    useEffect(() => {
        const loadPrevious = async () => {
            try {
                const response = await api.get('/applications/my');
                const raw = response?.data?.data ?? response?.data?.applications ?? response?.data ?? [];
                const list = Array.isArray(raw) ? raw : [];
                setPrevData(list);
            } catch {
               
            }
        };
        loadPrevious();
    }, []);

    /* ─── Validation ─── */
    const validate1 = () => {
        const e = {};
        if (!form.child_name_bn.trim())   e.child_name_bn   = b.err_nameBn;
        if (!form.father_name_bn.trim())  e.father_name_bn  = b.err_fatherName;
        if (!form.father_name_en.trim())  e.father_name_en  = b.err_fatherNameEn ?? "Father's name (English) is required";
        if (!form.mother_name_bn.trim())  e.mother_name_bn  = b.err_motherName;
        if (!form.mother_name_en.trim())  e.mother_name_en  = b.err_motherNameEn ?? "Mother's name (English) is required";
        if (!form.birth_date)             e.birth_date      = b.err_dob;
        if (!form.gender)                 e.gender          = b.err_gender;
        if (!form.birth_place.trim())     e.birth_place     = b.err_birthPlace;
        if (!form.district.trim())        e.district        = b.err_district;
        if (!form.present_address.trim()) e.present_address = b.err_presentAddress;
        setErr(e);
        return Object.keys(e).length === 0;
    };
    const validate2 = () => { if (files.length === 0) { alert(b.err_noDoc); return false; } return true; };

    const handleFiles = e => setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    const removeFile  = i => setFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleSubmit = async () => {
        setBusy(true);
        setSubmitError('');
        try {
            const fd = new FormData();

            fd.append('child_name_bn',     form.child_name_bn.trim());
            fd.append('child_name_en',     form.child_name_en.trim());
            fd.append('birth_date',        form.birth_date);
            fd.append('birth_place',       `${form.birth_place.trim()}, ${form.district.trim()}`);
            fd.append('gender',            form.gender);
            fd.append('father_name_bn',    form.father_name_bn.trim());
            fd.append('mother_name_bn',    form.mother_name_bn.trim());
            fd.append('father_name_en',     form.father_name_en.trim());
            fd.append('father_nationality', form.father_nationality.trim());
            fd.append('mother_name_en',     form.mother_name_en.trim());
            fd.append('mother_nationality', form.mother_nationality.trim());
           
            fd.append('permanent_address', form.permanent_address.trim() || form.present_address.trim());
            fd.append('fee_amount',        '100');
          
            files.forEach(f => fd.append('documents', f));

            
            const response = await api.post('/applications', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const tid = response?.data?.data?.tracking_id || response?.data?.tracking_id;
            const aid = response?.data?.data?.app_id      || response?.data?.app_id || response?.data?.data?.id || response?.data?.id;

            setTrackingId(tid || `TRK-${Date.now()}`);
            setAppId(aid || '');
            setStep(4);

        } catch (e) {
            console.error('Submit error:', e);
            setSubmitError(
                e?.response?.data?.error || e?.response?.data?.message || e?.message || 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।'
            );
        } finally {
            setBusy(false);
        }
    };

    /*SUCCESS SCREEN */
    if (step === 4) return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <PageHeader b={b} c={c} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 'calc(100vh - 68px)' }}>
                <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: '#111827', marginBottom: 10 }}>{b.successTitle}</div>
                    <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 28 }}>{b.successLine1}<br />{b.successLine2}</div>
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '18px 22px', marginBottom: 28, textAlign: 'left' }}>
                        <InfoRow label={b.lbl_trackingId}  value={trackingId} />
                        <InfoRow label={b.lbl_service}     value={b.lbl_serviceName} />
                        <InfoRow label={b.lbl_fee}         value={b.feeAmount} />
                        <InfoRow label={b.lbl_processing}  value={b.lbl_processingVal} />
                    </div>

                    {/*  Dashboard + Pay Now */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                flex: 1, padding: '13px',
                                border: '1.5px solid #d1d5db', borderRadius: 10,
                                background: 'white', cursor: 'pointer',
                                fontSize: 14, fontWeight: 600, color: '#374151',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {b.backToDash ?? 'Back to Dashboard'}
                        </button>

                        <button
                            onClick={() => navigate(`/payment/${appId}`)}
                            style={{
                                flex: 1, padding: '13px',
                                border: 'none', borderRadius: 10,
                                background: 'linear-gradient(135deg,#166534,#15803d)',
                                cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 4px 14px rgba(22,101,52,0.25)',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
                                <path d="M2 10h20" stroke="white" strokeWidth="1.8"/>
                            </svg>
                            {b.payNow ?? 'Pay Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ══════ MAIN FORM ══════ */
    return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f4f6f4', minHeight: '100vh' }}>
            <style>{`
                @media(max-width:600px){
                    .bc-username { display: none; }
                    .bc-form-grid { grid-template-columns: 1fr !important; }
                    .bc-form-grid > div { grid-column: span 1 !important; }
                    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                }
            `}</style>
            <PageHeader b={b} c={c} />

            <div style={{ maxWidth: 780, margin: '0 auto', padding: '36px 24px' }}>
                <StepBar current={step} steps={b.steps ?? ['তথ্য পূরণ', 'নথিপত্র আপলোড', 'নিশ্চিত করুন']} />

                {/* ════ STEP 1 ════ */}
                {step === 1 && (
                    <div style={{ background: 'white', borderRadius: 16, padding: '32px 36px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 4 }}>{b.step1Title}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>{b.step1Sub}</div>



                        <div className="bc-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>

                            <Field label={b.nameBn} required half error={err.child_name_bn}>
                                <input value={form.child_name_bn} onChange={e => set('child_name_bn', e.target.value)} placeholder={b.ph_nameBn} style={{ ...inputSt, borderColor: err.child_name_bn ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.nameEn} half>
                                <input value={form.child_name_en} onChange={e => set('child_name_en', e.target.value)} placeholder={b.ph_nameEn} style={inputSt} />
                            </Field>

                            <Field label={b.fatherName} required half error={err.father_name_bn}>
                                <input value={form.father_name_bn} onChange={e => set('father_name_bn', e.target.value)} placeholder={b.ph_fatherName} style={{ ...inputSt, borderColor: err.father_name_bn ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.motherName} required half error={err.mother_name_bn}>
                                <input value={form.mother_name_bn} onChange={e => set('mother_name_bn', e.target.value)} placeholder={b.ph_motherName} style={{ ...inputSt, borderColor: err.mother_name_bn ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.dob} required half error={err.birth_date}>
                                <input type="date" value={form.birth_date} onChange={e => set('birth_date', e.target.value)} style={{ ...inputSt, borderColor: err.birth_date ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.gender} required half error={err.gender}>
                                <select value={form.gender} onChange={e => set('gender', e.target.value)} style={{ ...inputSt, borderColor: err.gender ? '#EF4444' : '#e5e7eb', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                                    <option value="">{b.genderSelect}</option>
                                    <option value="male">{b.genderMale}</option>
                                    <option value="female">{b.genderFemale}</option>
                                    <option value="other">{b.genderOther}</option>
                                </select>
                            </Field>

                            <Field label={b.birthPlace} required half error={err.birth_place}>
                                <input value={form.birth_place} onChange={e => set('birth_place', e.target.value)} placeholder={b.ph_birthPlace} style={{ ...inputSt, borderColor: err.birth_place ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={c.district} required half error={err.district}>
                                <input value={form.district} onChange={e => set('district', e.target.value)} placeholder={b.ph_district} style={{ ...inputSt, borderColor: err.district ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.presentAddress} required error={err.present_address}>
                                <SuggestInput value={form.present_address} onChange={v => set('present_address', v)} placeholder={b.ph_presentAddress} style={inputSt} error={err.present_address}
                                    suggestions={[...new Set(prevData.map(a => a.permanent_address).filter(Boolean))]} />
                            </Field>

                            <Field label={b.permanentAddress}>
                                <SuggestInput value={form.permanent_address} onChange={v => set('permanent_address', v)} placeholder={b.ph_permanentAddress} style={inputSt}
                                    suggestions={[...new Set(prevData.map(a => a.permanent_address).filter(Boolean))]} />
                            </Field>

                            <Field label={b.fatherNameEn ?? "পিতার নাম (ইংরেজি)"} required half error={err.father_name_en}>
                                <input value={form.father_name_en} onChange={e => set('father_name_en', e.target.value)} placeholder={b.ph_fatherNameEn ?? "Father's full name"} style={{ ...inputSt, borderColor: err.father_name_en ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.fatherNationality ?? "পিতার জাতীয়তা"} half>
                                <input value={form.father_nationality} onChange={e => set('father_nationality', e.target.value)} placeholder={b.ph_fatherNationality ?? "যেমন: বাংলাদেশি"} style={inputSt} />
                            </Field>

                            <Field label={b.motherNameEn ?? "মাতার নাম (ইংরেজি)"} required half error={err.mother_name_en}>
                                <input value={form.mother_name_en} onChange={e => set('mother_name_en', e.target.value)} placeholder={b.ph_motherNameEn ?? "Mother's full name"} style={{ ...inputSt, borderColor: err.mother_name_en ? '#EF4444' : '#e5e7eb' }} />
                            </Field>

                            <Field label={b.motherNationality ?? "মাতার জাতীয়তা"} half>
                                <input value={form.mother_nationality} onChange={e => set('mother_nationality', e.target.value)} placeholder={b.ph_motherNationality ?? "যেমন: বাংলাদেশি"} style={inputSt} />
                            </Field>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                            <button onClick={() => { if (validate1()) setStep(2); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: 'none', borderRadius: 10, background: '#166534', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white' }}>
                                {b.nextStep}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ════ STEP 2 ════ */}
                {step === 2 && (
                    <div style={{ background: 'white', borderRadius: 16, padding: '32px 36px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 4 }}>{b.step2Title}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>{b.step2Sub}</div>

                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8', marginBottom: 10 }}>{b.docListTitle}</div>
                            {(b.docs ?? []).map((doc, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', marginTop: 5, flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, color: '#1E40AF' }}>{doc}</span>
                                </div>
                            ))}
                        </div>

                        <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }} style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: '32px 20px', cursor: 'pointer', textAlign: 'center', background: '#fafafa', marginBottom: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" /><polyline points="17 8 12 3 7 8" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{b.dropzone}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{b.dropzoneSub}</div>
                            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} style={{ display: 'none' }} />
                        </div>

                        {files.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 10 }}>
                                    {typeof b.uploadedFiles === 'function' ? b.uploadedFiles(files.length) : `${b.uploadedFiles} (${files.length})`}
                                </div>
                                {files.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, marginBottom: 8 }}>
                                        <div style={{ width: 32, height: 32, background: '#dcfce7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#166534" strokeWidth="1.6" /></svg>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, color: '#166534', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                                            <div style={{ fontSize: 11, color: '#6B7280' }}>{(f.size / 1024).toFixed(0)} KB</div>
                                        </div>
                                        <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4, borderRadius: 4 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 22px', border: '1.5px solid #d1d5db', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                {b.prevStep}
                            </button>
                            <button onClick={() => { if (validate2()) setStep(3); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 28px', border: 'none', borderRadius: 10, background: '#166534', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white' }}>
                                {b.nextStep}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ════ STEP 3 ════ */}
                {step === 3 && (
                    <div style={{ background: 'white', borderRadius: 16, padding: '32px 36px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 4 }}>{b.step3Title}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>{b.step3Sub}</div>

                        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '4px 16px', marginBottom: 20 }}>
                            <InfoRow label={b.confirm_name}       value={form.child_name_bn} />
                            <InfoRow label={b.confirm_father}     value={form.father_name_bn} />
                            <InfoRow label={b.confirm_mother}     value={form.mother_name_bn} />
                            <InfoRow label={b.confirm_dob}        value={form.birth_date} />
                            <InfoRow label={b.confirm_gender}     value={form.gender === 'male' ? b.genderMale : form.gender === 'female' ? b.genderFemale : b.genderOther} />
                            <InfoRow label={b.confirm_birthPlace} value={`${form.birth_place}, ${form.district}`} />
                            <InfoRow label={b.confirm_address}    value={form.permanent_address || form.present_address} />
                            <InfoRow label={b.fatherNameEn ?? "পিতার নাম (ইংরেজি)"}  value={form.father_name_en} />
                            {form.father_nationality && <InfoRow label={b.fatherNationality ?? "পিতার জাতীয়তা"}      value={form.father_nationality} />}
                            <InfoRow label={b.motherNameEn ?? "মাতার নাম (ইংরেজি)"}  value={form.mother_name_en} />
                            {form.mother_nationality && <InfoRow label={b.motherNationality ?? "মাতার জাতীয়তা"}      value={form.mother_nationality} />}
                        </div>

                        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 10 }}>
                                {typeof b.attachedDocs === 'function' ? b.attachedDocs(files.length) : `${b.attachedDocs} (${files.length})`}
                            </div>
                            {files.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6B7280" strokeWidth="1.6" /></svg>
                                    <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{f.name}</span>
                                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{(f.size / 1024).toFixed(0)} KB</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#FFF4E5', border: '1px solid #F5C369', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 2 }}>{b.feeTitle}</div>
                                <div style={{ fontSize: 12, color: '#B45309' }}>{b.feeSub}</div>
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#D97706' }}>{b.feeAmount}</div>
                        </div>

                        {/* Error message */}
                        {submitError && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#991B1B' }}>
                                ⚠️ {submitError}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 22px', border: '1.5px solid #d1d5db', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                {b.prevStep}
                            </button>
                            <button onClick={handleSubmit} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 28px', border: 'none', borderRadius: 10, background: busy ? '#86efac' : '#166534', cursor: busy ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, color: 'white', transition: 'background 0.2s' }}>
                                {busy ? (
                                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" strokeDasharray="28 56" /></svg>{b.submitting}</>
                                ) : (
                                    <>{b.confirmSubmit}<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></>
                                )}
                            </button>
                        </div>
                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BirthCertificateApplyPage;