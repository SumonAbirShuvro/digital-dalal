import { useState, useEffect, useRef } from 'react';  
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const PageHeader = ({ c }) => {
    const navigate          = useNavigate();
    const user              = getUser();
    const { lang, setLang } = useLanguage();
    const displayName = user?.name || user?.email?.split('@')[0] || 'User';
    const displaySub  = user?.mobile || user?.email || '';
    const handleLogout = () => { removeToken(); removeUser(); navigate('/login'); };

    return (
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '8px clamp(12px,3vw,28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, minHeight: 68, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
                        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>{c.portalName}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{c.portalSub}</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: lang === 'en' ? 700 : 400, color: lang === 'en' ? '#166534' : '#6B7280' }}>EN</button>
                    <span style={{ color: '#d1d5db' }}>/</span>
                    <button onClick={() => setLang('bn')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: lang === 'bn' ? 700 : 400, color: lang === 'bn' ? '#166534' : '#6B7280' }}>বাংলা</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{displayName}</div>
                        {displaySub && <div style={{ fontSize: 12, color: '#6B7280' }}>{displaySub}</div>}
                    </div>
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8"/><circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.8"/></svg>
                    </div>
                </div>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
            </div>
        </header>
    );
};

const MethodCard = ({ id, selected, onSelect, icon, name, description, color, badge }) => (
    <div onClick={() => onSelect(id)} style={{ border: selected === id ? `2px solid ${color}` : '1.5px solid #e5e7eb', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', background: selected === id ? `${color}0d` : 'white', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 14, boxShadow: selected === id ? `0 4px 16px ${color}20` : '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === id ? color : '#d1d5db'}`, background: selected === id ? color : 'white', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
            {selected === id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }}/>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{name}</span>
                {badge && <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{badge}</span>}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{description}</div>
        </div>
        {selected === id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
);

const PaymentPage = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { id }    = useParams();
    const { t }     = useLanguage();
    const c         = t('common');
    const user      = getUser();

    const state       = location.state || {};
    const appId       = state.appId       || id || '';
    const trackingId  = state.trackingId  || id || '—';
    const fee         = state.fee         ?? 100;
    const serviceType = state.serviceType || 'Birth Certificate';

    const [selectedMethod, setSelectedMethod] = useState('bkash');
    const [mobileNumber, setMobileNumber]     = useState(user?.mobile || '');
    const [processing, setProcessing]         = useState(false);
    const [error, setError]                   = useState('');
    const [appInfo, setAppInfo]               = useState(null);

    const isSubmitting = useRef(false); 

    useEffect(() => {
        if (appId && appId !== '—') {
            api.get(`/applications/${appId}`)
                .then(res => {
                    const data = res?.data?.data ?? res?.data ?? res;
                    setAppInfo(data);
                })
                .catch(() => {});
        }
    }, [appId]);

    const actualFee      = appInfo?.fee_amount ?? fee;
    const actualTracking = appInfo?.tracking_id ?? trackingId;
    const applicantName  = appInfo?.child_name_en || appInfo?.child_name_bn || user?.name || 'Applicant';

    const paymentMethods = [
        { id: 'bkash',  name: 'bKash',  color: '#E2136E', icon: '💳', description: 'bKash মোবাইল একাউন্ট দিয়ে পেমেন্ট করুন',  badge: 'Popular' },
        { id: 'nagad',  name: 'Nagad',  color: '#F7941D', icon: '📱', description: 'Nagad মোবাইল একাউন্ট দিয়ে পেমেন্ট করুন'   },
        { id: 'rocket', name: 'Rocket', color: '#8B5CF6', icon: '🚀', description: 'Dutch-Bangla Rocket দিয়ে পেমেন্ট করুন'    },
        { id: 'card',   name: 'Card',   color: '#3B82F6', icon: '💳', description: 'Visa / Mastercard / Amex'                   },
    ];

    const selectedInfo = paymentMethods.find(m => m.id === selectedMethod);

    const handlePay = async () => {
      
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        if (!mobileNumber.trim() && selectedMethod !== 'card') {
            setError('মোবাইল নম্বর দিন।');
            isSubmitting.current = false; 
            return;
        }
        setError('');
        setProcessing(true);

        try {
            const response = await api.post('/payment/initiate', {
                amount:         parseFloat(actualFee),
                serviceName:    serviceType,
                customerName:   applicantName,
                customerMobile: mobileNumber.trim() || user?.mobile || '',
                customerEmail:  user?.email || '',
                userId:         user?.userId,
                appId:          appId,
                trackingId:     actualTracking,
                paymentMethod:  selectedMethod,
            });

            if (response?.data?.paymentUrl || response?.paymentUrl) {
                const paymentUrl = response?.data?.paymentUrl || response?.paymentUrl;
                window.location.href = paymentUrl;
                
            } else {
                throw new Error('Payment URL পাওয়া যায়নি');
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(
                err?.response?.data?.error ||
                err?.message ||
                'পেমেন্ট শুরু করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
            );
            setProcessing(false);
            isSubmitting.current = false; 
        }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#f0f4f3', minHeight: '100vh' }}>
            <PageHeader c={c} />

            <div style={{ padding: '18px 32px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 14, padding: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    My Applications
                </button>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>Payment</span>
            </div>

            <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>পেমেন্ট সম্পন্ন করুন</div>
                        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>পেমেন্ট পদ্ধতি বেছে নিন</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                        {paymentMethods.map(m => (
                            <MethodCard key={m.id} id={m.id} selected={selectedMethod} onSelect={setSelectedMethod} icon={m.icon} name={m.name} description={m.description} color={m.color} badge={m.badge} />
                        ))}
                    </div>

                    {selectedMethod !== 'card' && (
                        <div style={{ background: 'white', borderRadius: 14, padding: '20px 22px', marginBottom: 20, border: '1.5px solid #e5e7eb' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>
                                {selectedInfo?.name} নম্বর
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#f9fafb' }}>
                                <div style={{ padding: '12px 14px', background: '#f3f4f6', borderRight: '1.5px solid #e5e7eb', fontSize: 14, color: '#374151', fontWeight: 600 }}>+880</div>
                                <input
                                    type="tel"
                                    placeholder="01XXXXXXXXX"
                                    value={mobileNumber}
                                    onChange={e => setMobileNumber(e.target.value)}
                                    maxLength={11}
                                    style={{ flex: 1, padding: '12px 14px', border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#111827' }}
                                />
                            </div>
                            {error && <div style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>⚠️ {error}</div>}
                        </div>
                    )}

                    {selectedMethod === 'card' && (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8', marginBottom: 6 }}>💳 Card Payment</div>
                            <div style={{ fontSize: 13, color: '#374151' }}>
                                আপনাকে UddoktaPay-এর secure payment page-এ নিয়ে যাওয়া হবে যেখানে card details দিতে পারবেন।
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePay}
                        disabled={processing}
                        style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 12, background: processing ? '#9CA3AF' : `linear-gradient(135deg,${selectedInfo?.color ?? '#166534'},${selectedInfo?.color ?? '#15803d'}cc)`, color: 'white', fontWeight: 700, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer', boxShadow: processing ? 'none' : `0 4px 16px ${selectedInfo?.color ?? '#166534'}40`, transition: 'opacity 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                    >
                        {processing ? (
                            <>
                                <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
                                UddoktaPay-এ যাচ্ছেন...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/><path d="M2 10h20" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                Pay ৳{actualFee} via {selectedInfo?.name}
                            </>
                        )}
                    </button>

                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: '#6B7280', fontSize: 12 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                        Secured by UddoktaPay • SSL Encrypted
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: 18, padding: '26px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: 88 }}>
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 20 }}>Order Summary</div>
                    <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#166534,#15803d)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.6"/><path d="M8 13h8M8 17h5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{serviceType}</div>
                            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, fontFamily: 'monospace' }}>{actualTracking}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: '#6B7280' }}>Service Fee</span>
                            <span style={{ fontWeight: 600, color: '#111827' }}>৳{actualFee}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: '#6B7280' }}>Processing Fee</span>
                            <span style={{ fontWeight: 600, color: '#10B981' }}>Free</span>
                        </div>
                    </div>
                    <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0 16px' }}/>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: 26, color: '#059669', letterSpacing: '-0.5px' }}>৳{actualFee}</span>
                    </div>
                    <div style={{ marginTop: 20, background: `${selectedInfo?.color}10`, border: `1px solid ${selectedInfo?.color}30`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                        <span style={{ fontSize: 16 }}>{selectedInfo?.icon}</span>
                        Paying via <strong>{selectedInfo?.name}</strong>
                    </div>
                    <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
                        Powered by UddoktaPay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;