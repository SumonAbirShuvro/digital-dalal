import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

const VerificationCode = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { contact, userId, role, redirectTo } = location.state || {};

    const [otp, setOtp]             = useState(['', '', '', '']);
    const [error, setError]         = useState('');
    const [loading, setLoading]     = useState(false);
    const [timer, setTimer]         = useState(30);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const sendOTP = async () => {
        try {
            await authAPI.sendOTP({ userId, contact });
            console.log('✅ OTP sent to:', contact);
        } catch (err) {
            console.error('❌ OTP Send Error:', err);
            setError('OTP পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
    };

    useEffect(() => {

        // OTPVerification.jsx ইতিমধ্যে OTP পাঠিয়েছে
        if (!userId || !contact) {
            navigate('/register');
        }
    }, [userId, contact, navigate]);

    // 30 sec countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(p => p - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) inputRefs[index + 1].current.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0)
            inputRefs[index - 1].current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 4) { setError('৪ সংখ্যার কোড দিন'); return; }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP({ userId, otp: code });
            if (response) {
                navigate('/success', {
                    state: { role, redirectTo }
                });
            }
        } catch (err) {
            console.error('Verify error:', err);
            setError('কোড ভুল অথবা মেয়াদ শেষ হয়ে গেছে');
            setOtp(['', '', '', '']);
            inputRefs[0].current.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(30);
        setCanResend(false);
        setError('');
        await sendOTP();
    };

    return (
        <div className="verification-container">
            <div className="verification-card">

                <h2 className="verification-title">Verification Code</h2>

                <p className="verification-info">
                    Code sent to <strong>{contact}</strong>
                </p>

                {error && (
                    <div className="error-message" style={{ marginBottom: 12 }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="verification-form">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`otp-box ${digit ? 'filled' : ''}`}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="btn-continue"
                        disabled={loading || otp.join('').length !== 4}
                    >
                        {loading ? 'যাচাই করা হচ্ছে...' : 'Continue'}
                    </button>
                </form>

                <div className="resend-section">
                    {canResend ? (
                        <button className="resend-btn" onClick={handleResend}>
                            Resend Code
                        </button>
                    ) : (
                        <p className="timer-text">Resend code in {timer}s</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VerificationCode;
