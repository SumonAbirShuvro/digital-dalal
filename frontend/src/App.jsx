import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "./utils/auth";
import { LanguageProvider } from "./context/LanguageContext";

import HomePage              from "./components/public/HomePage";
import AboutPage             from "./components/public/AboutPage";
import AvailableServicesPage from "./components/public/AvailableServicesPage";
import ContactPage           from "./components/public/ContactPage";

import Login            from "./components/auth/Login";
import Register         from "./components/auth/Register";
import OTPVerification  from "./components/auth/OTPVerification";
import VerificationCode from "./components/auth/VerificationCode";
import SuccessPage      from "./components/auth/SuccessPage";

import CitizenDashboard          from "./components/dashboard/CitizenDashboard";
import ReviewHandlerDashboard    from "./components/dashboard/ReviewHandlerDashboard";
import ReviewRequestPage         from "./components/dashboard/ReviewRequestPage";
import AdminDashboard            from "./components/dashboard/AdminDashboard";
import BirthCertificateApplyPage from "./components/dashboard/BirthCertificateApplyPage";
import ApplicationDashbord       from "./components/dashboard/ApplicationDashbord";
import PaymentPage               from "./components/dashboard/PaymentPage";
import PaymentSuccessPage        from "./components/dashboard/PaymentSuccessPage";
import PaymentCancelPage         from "./components/dashboard/PaymentCancelPage";
import TrackingPage              from "./components/dashboard/TrackingPage";
import FeedbackPage              from "./components/public/FeedbackPage";


/* ── Global Chat Support Button ── */
function ChatSupportButton() {
    return (
        <button
            style={{
                position: 'fixed', bottom: 24, right: 24,
                width: 52, height: 52,
                background: '#166534', color: 'white',
                border: 'none', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 9999,
                boxShadow: '0 4px 16px rgba(22,101,52,0.35)',
                transition: 'transform 0.2s',
            }}
            title="সাহায্য দরকার?"
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 10h8M8 14h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        </button>
    );
}

const ProtectedRoute = ({ children }) =>
    isAuthenticated() ? children : <Navigate to="/login" replace />;

const RootRedirect = () => {
    if (!isAuthenticated()) return <Navigate to="/home" replace />;
    const role = getUser()?.role;
    if (role === 'review_handler') return <Navigate to="/review-handler/dashboard" replace />;
    if (role === 'admin')   return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/"        element={<RootRedirect />} />
                    <Route path="/home"     element={<HomePage />} />
                    <Route path="/about"    element={<AboutPage />} />
                    <Route path="/services" element={<AvailableServicesPage />} />
                    <Route path="/contact"  element={<ContactPage />} />
                    <Route path="/login"             element={<Login />} />
                    <Route path="/register"          element={<Register />} />
                    <Route path="/otp-verification"  element={<OTPVerification />} />
                    <Route path="/verification-code" element={<VerificationCode />} />
                    <Route path="/success"           element={<SuccessPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>}/>
                    <Route path="/review-handler/dashboard" element={<ProtectedRoute><ReviewHandlerDashboard /></ProtectedRoute>}/>
                    <Route path="/review-handler/review/:id" element={<ProtectedRoute><ReviewRequestPage /></ProtectedRoute>}/>
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
                    <Route path="/apply/birth-certificate" element={<ProtectedRoute><BirthCertificateApplyPage /></ProtectedRoute>}/>
                    <Route path="/applications" element={<ProtectedRoute><ApplicationDashbord /></ProtectedRoute>}/>
                    <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDashbord /></ProtectedRoute>}/>
                    
                    <Route path="/payment/success" element={<PaymentSuccessPage />}/>
                    <Route path="/payment/cancel"  element={<PaymentCancelPage />}/>
                    <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}/>
                    <Route path="/track/:id" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>}/>
                    <Route path="/download/:id" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>}/>
                    <Route path="/feedback" element={<FeedbackPage />}/>
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;
