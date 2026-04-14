import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('bn');
    const [showRoles, setShowRoles] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        currentAddress: '',
        password: '',
        role: ''
    });

    const translations = {
        bn: {
            title: 'Smart Citizen Service Tracker',
            subtitle: 'Bangladesh Digital Services Portal',
            fullName: 'সম্পূর্ণ নাম:',
            phoneNo: 'ফোন নং:',
            email: 'ইমেইল:',
            currentAddress: 'বর্তমান ঠিকানা:',
            password: 'পাসওয়ার্ড:',
            roleLabel: 'ভূমিকা:',
            rolesBtn: 'Roles ▾',
            registerButton: 'রেজিস্টার',
            registering: 'রেজিস্টার হচ্ছে...',
            haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
            login: 'লগইন করুন',
            roleRequired: 'অনুগ্রহ করে একটি ভূমিকা নির্বাচন করুন',
            fillAll: 'নাম, ফোন নম্বর এবং পাসওয়ার্ড দিন'
        },
        en: {
            title: 'Smart Citizen Service Tracker',
            subtitle: 'Bangladesh Digital Services Portal',
            fullName: 'Full Name:',
            phoneNo: 'Phone No:',
            email: 'Email:',
            currentAddress: 'Current Address:',
            password: 'Password:',
            roleLabel: 'Role:',
            rolesBtn: 'Roles ▾',
            registerButton: 'Register',
            registering: 'Registering...',
            haveAccount: 'Already have an account?',
            login: 'Login here',
            roleRequired: 'Please select a role',
            fillAll: 'Please enter name, phone and password'
        }
    };

    const t = translations[language];

    const roles = [
        { value: 'Citizen',        label: 'Citizen',        icon: '👤' },
        { value: 'Admin',          label: 'Admin',          icon: '🛡️' },
        { value: 'Review_Handler', label: 'Review Handler',  icon: '🔍' }
    ];

    const getDashboardPath = (role) => {
        switch (role) {
            case 'Admin':          return '/admin/dashboard';
            case 'Review_Handler': return '/review-handler/dashboard';
            default:        return '/citizen/dashboard';
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Role select — updates formData.role directly, no form field conflict
    const handleRoleSelect = (roleValue) => {
        setFormData(prev => ({ ...prev, role: roleValue }));
        setShowRoles(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Manual validation — only name, mobile, password are required
        if (!formData.name.trim() || !formData.mobile.trim() || !formData.password.trim()) {
            setError(t.fillAll);
            return;
        }

        if (!formData.role) {
            setError(t.roleRequired);
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register(formData);
            console.log('Register API Response:', response);

            const userId =
                response?.data?.userId ||
                response?.data?.id ||
                response?.userId ||
                response?.id;

            navigate('/otp-verification', {
                state: {
                    email:      formData.email,
                    mobile:     formData.mobile,
                    userId:     userId,
                    role:       formData.role,
                    redirectTo: getDashboardPath(formData.role)
                }
            });

        } catch (err) {
            console.error('Registration Error:', err);
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err.message ||
                'Registration failed'
            );
        } finally {
            setLoading(false);
        }
    };

    const selectedRole = roles.find(r => r.value === formData.role);

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
                        <div className="logo-circle" style={{background:"transparent",border:"none",boxShadow:"none"}}>
                            <svg width="52" height="36" viewBox="0 0 52 36" xmlns="http://www.w3.org/2000/svg">
                            <rect width="52" height="36" rx="4" fill="#006A4E"/>
                            <circle cx="24" cy="18" r="11" fill="#F42A41"/>
                        </svg>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="auth-header">
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {/*
                        IMPORTANT: No required attributes on inputs.
                        All validation is handled manually in handleSubmit
                        to avoid browser HTML5 validation blocking role selection.
                    */}
                    <form onSubmit={handleSubmit} className="auth-form" noValidate>

                        {/* Row 1: Full Name + Phone */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t.fullName}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your full name'}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t.phoneNo}</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                        </div>

                        {/* Row 2: Email + Role Dropdown */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t.email}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />
                            </div>

                            {/* Role Dropdown — beside Email */}
                            <div className="form-group role-wrapper">
                                <label>{t.roleLabel}</label>

                                <button
                                    type="button"
                                    className={`role-dropdown-trigger ${formData.role ? 'role-selected' : ''}`}
                                    onClick={() => setShowRoles(prev => !prev)}
                                >
                                    <span>
                                        {selectedRole
                                            ? `${selectedRole.icon} ${selectedRole.label}`
                                            : t.rolesBtn}
                                    </span>
                                    <span className={`role-arrow ${showRoles ? 'open' : ''}`}>▾</span>
                                </button>

                                {showRoles && (
                                    <div className="role-options">
                                        {roles.map((role) => (
                                            <label
                                                key={role.value}
                                                className={`role-option ${formData.role === role.value ? 'role-option-selected' : ''}`}
                                                onClick={() => handleRoleSelect(role.value)}
                                            >
                                                {/*
                                                    name="roleRadio" — different from formData field name "role"
                                                    This prevents browser treating it as a form field
                                                    and avoids HTML5 validation conflicts
                                                */}
                                                <input
                                                    type="radio"
                                                    name="roleRadio"
                                                    value={role.value}
                                                    checked={formData.role === role.value}
                                                    onChange={() => handleRoleSelect(role.value)}
                                                    style={{ accentColor: '#0f766e' }}
                                                />
                                                <span className="role-icon">{role.icon}</span>
                                                <span className="role-label">{role.label}</span>
                                                {formData.role === role.value && (
                                                    <span className="role-check">✓</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 3: Current Address + Password (side by side) */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t.currentAddress}</label>
                                <input
                                    type="text"
                                    name="currentAddress"
                                    value={formData.currentAddress}
                                    onChange={handleChange}
                                    placeholder={language === 'bn' ? 'আপনার ঠিকানা' : 'Your address'}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t.password}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? t.registering : t.registerButton}
                        </button>

                    </form>

                    <div className="auth-footer" style={{ marginTop: '20px' }}>
                        <p>
                            {t.haveAccount}{' '}
                            <Link to="/login">
                                <strong>{t.login}</strong>
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
        </>
    );
};

export default Register;
