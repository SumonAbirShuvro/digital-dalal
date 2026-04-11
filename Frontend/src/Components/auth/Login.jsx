import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { saveToken, saveUser } from '../../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('bn');
    const [formData, setFormData] = useState({
        mobile: '',
        password: ''
    });

    const translations = {
        bn: {
            title: 'Smart Citizen Service Tracker',
            subtitle: 'Bangladesh Digital Services Portal',
            emailLabel: 'মোবাইল নম্বর',
            emailPlaceholder: '01XXXXXXXXX',
            passwordLabel: 'পাসওয়ার্ড',
            passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
            signInButton: 'সাইন ইন',
            signingIn: 'সাইন ইন হচ্ছে...',
            forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
            noAccount: 'অ্যাকাউন্ট নেই?',
            register: 'রেজিস্টার করুন'
        },
        en: {
            title: 'Smart Citizen Service Tracker',
            subtitle: 'Bangladesh Digital Services Portal',
            emailLabel: 'Mobile Number',
            emailPlaceholder: '01XXXXXXXXX',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter your password',
            signInButton: 'Sign In',
            signingIn: 'Signing In...',
            forgotPassword: 'Forgot password?',
            noAccount: "Don't have an account?",
            register: 'Register here'
        }
    };

    const t = translations[language];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Backend returns role as lowercase: 'citizen' | 'officer' | 'admin'
    const getDashboardByRole = (role) => {
        switch (role) {
            case 'review_handler': return '/review-handler/dashboard';
            case 'admin':   return '/admin/dashboard';
            case 'citizen':
            default:        return '/dashboard';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);

            if (response.success) {
                saveToken(response.data.token);
                saveUser(response.data);

                console.log('✅ Login successful:', response.data);
                console.log('🔑 Role:', response.data.role);

                const role = (response.data.role || 'citizen').toLowerCase();
                navigate(getDashboardByRole(role));
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setError(
                err.response?.data?.error ||
                (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Language Selector */}
            <div className="language-selector">
                <button
                    className={language === 'bn' ? 'active' : ''}
                    onClick={() => setLanguage('bn')}
                >
                    বাংলা
                </button>
                <button
                    className={language === 'en' ? 'active' : ''}
                    onClick={() => setLanguage('en')}
                >
                    English
                </button>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="logo-circle">
                            <div className="bd-flag"></div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="auth-header">
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                {t.emailLabel}
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder={t.emailPlaceholder}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                                </svg>
                                {t.passwordLabel}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t.passwordPlaceholder}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? t.signingIn : t.signInButton}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <a href="#" className="forgot-password">
                            {t.forgotPassword}
                        </a>
                        <p>
                            {t.noAccount}{' '}
                            <Link to="/register">
                                <strong>{t.register}</strong>
                            </Link>
                        </p>
                        <p style={{ marginTop: 8 }}>
                            <Link to="/home" style={{ fontSize: 13, color: '#6b7280' }}>
                                ← {language === 'bn' ? 'হোমপেজে ফিরুন' : 'Back to Home'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Help Button */}
            <button className="help-button">?</button>
        </>
    );
};

export default Login;
