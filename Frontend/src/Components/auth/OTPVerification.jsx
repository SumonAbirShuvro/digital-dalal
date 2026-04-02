import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

const OTPVerification = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        contact,
        email,
        mobile,
        userId,
        role,
        redirectTo
    } = location.state || {};

    // Use email or mobile or contact as the contactInfo
    const [contactInfo, setContactInfo] = useState(email || mobile || contact || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            navigate('/register');
        }
    }, [userId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.sendOTP({
                userId: userId,
                contact: contactInfo
            });

            if (response) {
                navigate('/verification-code', {
                    state: {
                        contact: contactInfo,
                        userId: userId,
                        role: role,
                        redirectTo: redirectTo || getDashboardPath(role)
                    }
                });
            }

        } catch (err) {
            console.error(err);
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const getDashboardPath = (r) => {
        switch (r) {
            case 'Admin':   return '/admin/dashboard';
            case 'Officer': return '/officer/dashboard';
            case 'Citizen':
            default:        return '/citizen/dashboard';
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">

                {/* ── Illustration ── */}
                <div className="otp-illustration">

                    <div className="shield-circle">
                        <svg className="shield-icon" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 3L7 9v12c0 10.5 6.8 20.3 16 23 9.2-2.7 16-12.5 16-23V9L23 3z" fill="#1d6b4f" />
                            <path d="M15 23l5.5 5.5L31 18" stroke="#e53935" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <svg className="plant-blob" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="60" cy="110" rx="52" ry="44" fill="#e8ede9" />
                        <line x1="80" y1="155" x2="80" y2="80" stroke="#b0bdb2" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M80 110 Q50 80 55 55 Q80 75 80 110Z" fill="#b0bdb2" />
                        <path d="M80 95 Q108 70 105 48 Q82 65 80 95Z" fill="#c8d4ca" />
                    </svg>

                    <svg className="woman-figure" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="62" cy="22" r="16" fill="#c68642" />
                        <path d="M46 18 Q50 4 62 6 Q74 4 78 18 Q74 10 62 12 Q50 10 46 18Z" fill="#2d1a0e"/>
                        <path d="M48 38 Q42 60 44 80 L80 80 Q82 60 76 38 Q68 34 62 34 Q56 34 48 38Z" fill="#f0f0f0"/>
                        <path d="M48 42 Q30 38 22 28 Q26 24 30 28 Q36 36 50 46Z" fill="#c68642"/>
                        <path d="M76 42 Q90 56 88 68 Q84 70 82 66 Q82 54 72 48Z" fill="#c68642"/>
                        <path d="M44 80 L40 155 L58 155 L62 110 L66 155 L84 155 L80 80Z" fill="#2d2d2d"/>
                        <ellipse cx="44" cy="158" rx="10" ry="5" fill="#1a1a1a"/>
                        <ellipse cx="80" cy="158" rx="10" ry="5" fill="#1a1a1a"/>
                        <rect x="50" y="72" width="24" height="10" rx="2" fill="#c68642"/>
                    </svg>

                </div>

                {/* ── Heading ── */}
                <h2 className="otp-title">OTP Verification</h2>
                <p className="otp-subtitle">
                    Enter email and phone number to<br />send one time Password
                </p>

                {/* Role Badge */}
                {role && (
                    <div className="role-badge">
                        {role === 'Citizen' && '👤'}
                        {role === 'Admin' && '🛡️'}
                        {role === 'Officer' && '👮'}
                        {' '}{role}
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="otp-form">

                    <div className="form-group">
                        <label>Email/Phone:</label>
                        <input
                            type="text"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-continue"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Continue'}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default OTPVerification;
