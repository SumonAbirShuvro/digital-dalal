import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const invoiceId =
        params.get('invoice_id') ||
        params.get('invoiceId') ||
        localStorage.getItem('last_invoice_id') ||
        '';

    const isCancelled = window.location.pathname.includes('cancel');

    const [status,  setStatus]  = useState(isCancelled ? 'cancelled' : 'verifying');
    const [payData, setPayData] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (isCancelled) return;

        const verify = async (attempt = 0) => {
            if (!invoiceId) {
                setStatus('failed');
                return;
            }

            try {
                const res  = await api.post('/payment/verify', { invoice_id: invoiceId });
                const data = res?.data ?? res;

                console.log('Verify response:', data);

                const isPaid =
                    data?.success === true && (
                        data?.data?.status === 'paid' ||
                        data?.data?.gatewayData?.status === true ||
                        data?.data?.gatewayData?.payment_status === 'Completed' ||
                        data?.data?.gatewayData?.payment_status === 'completed'
                    );

                if (isPaid) {
                    localStorage.removeItem('last_invoice_id');
                    setPayData(data.data);
                    setStatus('success');
                } else if (attempt < 2) {
                    // Retry once after 3 seconds (webhook might be slightly delayed)
                    setTimeout(() => {
                        setRetryCount(attempt + 1);
                        verify(attempt + 1);
                    }, 3000);
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Verify error:', err);
                if (attempt < 2) {
                    setTimeout(() => verify(attempt + 1), 3000);
                } else {
                    setStatus('failed');
                }
            }
        };

        verify();
    }, [invoiceId, isCancelled]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f0f4f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Segoe UI',system-ui,sans-serif",
            padding: 20
        }}>
            <div style={{
                background: 'white',
                borderRadius: 24,
                padding: '48px 40px',
                textAlign: 'center',
                maxWidth: 420,
                width: '100%',
                boxShadow: '0 24px 64px rgba(0,0,0,0.12)'
            }}>

                {/* ── Verifying ── */}
                {status === 'verifying' && (
                    <>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            border: '4px solid #e5e7eb', borderTopColor: '#166534',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 24px'
                        }}/>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                            Payment Verifying...
                        </div>
                        <div style={{ fontSize: 14, color: '#6b7280' }}>
                            আপনার পেমেন্ট যাচাই করা হচ্ছে
                            {retryCount > 0 && ` (${retryCount}/2)`}
                        </div>
                    </>
                )}

                {/* ── Success ── */}
                {status === 'success' && (
                    <>
                        <div style={{
                            width: 80, height: 80,
                            background: 'linear-gradient(135deg,#10B981,#059669)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 24px rgba(16,185,129,0.35)'
                        }}>
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                            পেমেন্ট সফল! ✅
                        </div>
                        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
                            আপনার পেমেন্ট সফলভাবে প্রক্রিয়া হয়েছে।<br/>
                            আপনার আবেদনটি <strong style={{ color: '#166534' }}>In Progress</strong> এ রয়েছে।
                        </div>

                        {payData && (
                            <div style={{
                                background: '#f9fafb', borderRadius: 14,
                                padding: '16px 20px', marginBottom: 28, textAlign: 'left'
                            }}>
                                <Row label="Invoice ID"     value={payData.invoiceId}                           mono  />
                                {payData.transactionId && (
                                    <Row label="Transaction ID" value={payData.transactionId}                   mono  />
                                )}
                                <Row label="Amount Paid"    value={`৳${payData.amount}`}                        green />
                                <Row label="Service"        value={payData.serviceName || 'Birth Certificate'}        />
                                <Row label="Status"         value="Paid ✓"                                      green />
                                {payData.paidAt && (
                                    <Row label="Paid At" value={new Date(payData.paidAt).toLocaleString('bn-BD')} />
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                width: '100%', padding: '14px', border: 'none',
                                borderRadius: 12,
                                background: 'linear-gradient(135deg,#166534,#15803d)',
                                color: 'white', fontWeight: 700, fontSize: 15,
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(22,101,52,0.25)'
                            }}
                        >
                            Dashboard-এ ফিরুন
                        </button>
                    </>
                )}

                {/* ── Cancelled ── */}
                {status === 'cancelled' && (
                    <>
                        <div style={{
                            width: 80, height: 80,
                            background: 'linear-gradient(135deg,#F59E0B,#D97706)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 24px rgba(245,158,11,0.3)'
                        }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9v4M12 17h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                            পেমেন্ট বাতিল ⚠️
                        </div>
                        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
                            আপনি পেমেন্ট বাতিল করেছেন। আবার চেষ্টা করতে পারেন।
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    flex: 1, padding: '12px',
                                    border: '1.5px solid #d1d5db', borderRadius: 10,
                                    background: 'white', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', color: '#374151'
                                }}
                            >
                                ← Try Again
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    flex: 1, padding: '12px', border: 'none',
                                    borderRadius: 10, background: '#166534',
                                    color: 'white', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer'
                                }}
                            >
                                Dashboard
                            </button>
                        </div>
                    </>
                )}

                {/* ── Failed ── */}
                {status === 'failed' && (
                    <>
                        <div style={{
                            width: 80, height: 80,
                            background: 'linear-gradient(135deg,#EF4444,#DC2626)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 24px rgba(239,68,68,0.3)'
                        }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                            পেমেন্ট যাচাই ব্যর্থ ❌
                        </div>
                        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
                            পেমেন্ট যাচাই করা যায়নি। আবার চেষ্টা করুন।
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    flex: 1, padding: '12px',
                                    border: '1.5px solid #d1d5db', borderRadius: 10,
                                    background: 'white', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer', color: '#374151'
                                }}
                            >
                                ← Try Again
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    flex: 1, padding: '12px', border: 'none',
                                    borderRadius: 10, background: '#166534',
                                    color: 'white', fontWeight: 600, fontSize: 14,
                                    cursor: 'pointer'
                                }}
                            >
                                Dashboard
                            </button>
                        </div>
                    </>
                )}

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

function Row({ label, value, mono, green }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{label}</span>
            <span style={{
                fontSize: 13, fontWeight: 700,
                color: green ? '#059669' : '#111827',
                fontFamily: mono ? 'monospace' : 'inherit'
            }}>
                {value}
            </span>
        </div>
    );
}
