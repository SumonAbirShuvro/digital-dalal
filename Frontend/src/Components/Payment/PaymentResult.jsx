import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../services/paymentApi';
import './PaymentResult.css';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [error, setError] = useState('');

    const invoiceId = searchParams.get('invoice_id') || sessionStorage.getItem('uddokta_invoice_id');

    useEffect(() => {
        if (!invoiceId) {
            setStatus('no-transaction');
            return;
        }
        checkStatus();
    }, [invoiceId]);

    const checkStatus = async () => {
        try {
            const result = await verifyPayment(invoiceId);
            if (result.success && result.data?.gatewayData) {
                const gd = result.data.gatewayData;
                const rawStatus = (gd.payment_status || gd.status || '').toString().toLowerCase();
                let mapped = 'pending';
                if (['completed', 'paid', 'success'].includes(rawStatus)) mapped = 'paid';
                else if (['failed', 'expired', 'cancelled', 'declined'].includes(rawStatus)) mapped = 'failed';

                setPaymentInfo({
                    invoiceId,
                    amount: result.data.amount,
                    currency: result.data.currency,
                    serviceName: result.data.serviceName,
                    verifiedAt: result.data.verifiedAt,
                    createdAt: result.data.createdAt
                });
                setStatus(mapped);
            } else if (result.success) {
                setPaymentInfo(result.data);
                setStatus(result.data.status || 'pending');
            } else {
                setStatus('error');
                setError(result.error || 'Could not verify payment');
            }
        } catch (err) {
            console.error('Payment status check failed:', err);
            setStatus('error');
            setError(err.error || 'Failed to check payment status');
        }
    };

    const getConfig = () => {
        switch (status) {
            case 'paid':
                return { icon: '✅', title: 'Payment Successful!', subtitle: 'Your payment has been confirmed.', cls: 'payment-result--success' };
            case 'failed':
                return { icon: '❌', title: 'Payment Failed', subtitle: 'Your payment could not be processed.', cls: 'payment-result--failed' };
            case 'cancelled':
                return { icon: '🚫', title: 'Payment Cancelled', subtitle: 'You cancelled the payment process.', cls: 'payment-result--cancelled' };
            case 'pending':
                return { icon: '⏳', title: 'Payment Pending', subtitle: 'Your payment is being processed. Please wait...', cls: 'payment-result--pending' };
            case 'error':
                return { icon: '⚠️', title: 'Verification Error', subtitle: error, cls: 'payment-result--error' };
            case 'no-transaction':
                return { icon: '🔍', title: 'No Transaction Found', subtitle: 'We could not find your payment information.', cls: 'payment-result--error' };
            default:
                return { icon: '⏳', title: 'Checking Payment...', subtitle: 'Please wait while we verify your payment.', cls: 'payment-result--pending' };
        }
    };

    const config = getConfig();

    useEffect(() => {
        if (status === 'pending' || status === 'loading') {
            const interval = setInterval(checkStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [status]);

    const formatAmount = () => {
        if (!paymentInfo) return 'BDT 0';
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: paymentInfo.currency || 'BDT'
        }).format(paymentInfo.amount || 0);
    };

    const formatDate = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleString();
    };

    return (
        <div className={`payment-result-container ${config.cls}`}>
            <div className="payment-result-card">
                <div className="payment-result-icon">{config.icon}</div>
                <h1 className="payment-result-title">{config.title}</h1>
                <p className="payment-result-subtitle">{config.subtitle}</p>

                {paymentInfo && (
                    <div className="payment-result-details">
                        <div className="payment-detail-row">
                            <span>Invoice ID</span>
                            <strong>{paymentInfo.invoiceId}</strong>
                        </div>
                        <div className="payment-detail-row">
                            <span>Amount</span>
                            <strong>{formatAmount()}</strong>
                        </div>
                        <div className="payment-detail-row">
                            <span>Service</span>
                            <strong>{paymentInfo.serviceName || 'N/A'}</strong>
                        </div>
                        <div className="payment-detail-row">
                            <span>Date</span>
                            <strong>{formatDate(paymentInfo.verifiedAt || paymentInfo.createdAt)}</strong>
                        </div>
                    </div>
                )}

                <div className="payment-result-actions">
                    <button className="payment-result-btn payment-result-btn--primary" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </button>
                    {(status === 'failed' || status === 'cancelled' || status === 'error') && (
                        <button className="payment-result-btn payment-result-btn--secondary" onClick={() => navigate(-1)}>
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
