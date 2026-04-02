import { useNavigate, useLocation } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Receive role and redirectTo from VerificationCode
    const { role, redirectTo } = location.state || {};

    const getDashboardPath = (r) => {
        switch (r) {
            case 'Admin':   return '/admin/dashboard';
            case 'Officer': return '/officer/dashboard';
            default:        return '/citizen/dashboard';
        }
    };

    const handleDiscoverService = () => {
        // Navigate to role-based dashboard
        const destination = redirectTo || getDashboardPath(role);
        navigate(destination);
    };

    const roleLabel = {
        Citizen: { icon: '👤', color: '#0f766e', text: 'Citizen' },
        Admin:   { icon: '🛡️', color: '#1d4ed8', text: 'Admin'   },
        Officer: { icon: '👮', color: '#7c3aed', text: 'Officer'  }
    };

    const currentRole = role ? roleLabel[role] : null;

    return (
        <div className="success-container">
            <div className="success-card">

                {/* Success Icon */}
                <div className="success-icon-wrapper">
                    <svg
                        className="success-icon"
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Outer circle */}
                        <circle cx="50" cy="50" r="48" stroke="#0f766e" strokeWidth="3" fill="#f0fdf4" />
                        {/* Checkmark */}
                        <path
                            d="M28 52L42 66L72 36"
                            stroke="#0f766e"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Success Message */}
                <h2 className="success-title">Success!</h2>
                <p className="success-subtitle">
                    Congratulations! You have been<br />
                    successfully authenticated.
                </p>

                {/* Role Badge */}
                {currentRole && (
                    <div
                        className="success-role-badge"
                        style={{ borderColor: currentRole.color, color: currentRole.color }}
                    >
                        <span>{currentRole.icon}</span>
                        <span>You are registered as <strong>{currentRole.text}</strong></span>
                    </div>
                )}

                {/* Discover Service Button */}
                <button
                    className="btn-discover"
                    onClick={handleDiscoverService}
                >
                    Discover Service
                </button>

            </div>
        </div>
    );
};

export default SuccessPage;
