import { useNavigate } from 'react-router-dom';

export default function PaymentCancelPage() {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 8 }}>পেমেন্ট বাতিল</div>
                <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
                    আপনি পেমেন্ট বাতিল করেছেন।<br/>পরবর্তীতে Dashboard থেকে আবার পেমেন্ট করতে পারবেন।
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', border: '1.5px solid #d1d5db', borderRadius: 10, background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
                        ← Try Again
                    </button>
                    <button onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: '#166534', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
