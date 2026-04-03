import { useState } from 'react';
import { payNow } from '../../services/paymentApi';
import { getUser } from '../../utils/auth';
import './PayNowButton.css';

const PayNowButton = ({
    amount,
    serviceName,
    customerName,
    customerMobile,
    customerEmail,
    buttonText = 'Pay Now',
    buttonStyle = 'primary',
    disabled = false,
    className = '',
    onSuccess,
    onError,
    userId
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClick = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = getUser();
            const paymentData = {
                amount,
                serviceName,
                customerName,
                customerMobile,
                customerEmail: customerEmail || user?.email || '',
                userId: userId || user?.userId || null
            };

            const invoiceId = await payNow(paymentData);
            if (onSuccess) onSuccess(invoiceId);

        } catch (err) {
            console.error('Payment error:', err);
            const errorMsg = err.error || err.message || 'Payment failed. Please try again.';
            setError(errorMsg);
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amt) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amt);
    };

    return (
        <div className={`pay-now-wrapper ${className}`}>
            <button
                type="button"
                className={`pay-now-btn pay-now-btn--${buttonStyle}`}
                onClick={handleClick}
                disabled={loading || disabled || !amount}
                title={`Pay ${formatAmount(amount)}`}
            >
                {loading ? (
                    <span className="pay-now-btn__loading">
                        <span className="pay-now-spinner"></span>
                        Processing...
                    </span>
                ) : (
                    <span className="pay-now-btn__text">
                        {buttonText} — {formatAmount(amount)}
                    </span>
                )}
            </button>

            {error && (
                <div className="pay-now-error">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};

export default PayNowButton;
