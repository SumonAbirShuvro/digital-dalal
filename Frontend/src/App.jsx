import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "./utils/auth";
import { LanguageProvider } from "./Context/LanguageContext";

import HomePage from "./Components/public/HomePage";
import AboutPage from "./Components/public/AboutPage";
import AvailableServicesPage from "./Components/public/AvailableServicesPage";
import ContactPage from "./Components/public/ContactPage";
import FeedbackPage from "./Components/public/FeedbackPage";

import Login            from "./Components/Auth/Login";
import Register         from "./Components/Auth/Register";
import OTPVerification  from "./Components/Auth/OTPVerification";
import VerificationCode from "./Components/Auth/VerificationCode";
import SuccessPage      from "./Components/Auth/SuccessPage";

import CitizenDashboard          from "./Components/Dashboard/CitizenDashboard";
import ReviewHandlerDashboard    from "./Components/Dashboard/ReviewHandlerDashboard";
import ReviewRequestPage         from "./Components/Dashboard/ReviewRequestPage";
import AdminDashboard            from "./Components/Dashboard/AdminDashboard";
import BirthCertificateApplyPage from "./Components/Dashboard/BirthCertificateApplyPage";
import ApplicationDashbord       from "./Components/Dashboard/ApplicationDashbord";
import PaymentPage               from "./Components/Dashboard/PaymentPage";
import PaymentSuccessPage        from "./Components/Dashboard/PaymentSuccessPage";
import PaymentCancelPage         from "./Components/Dashboard/PaymentCancelPage";
import TrackingPage              from "./Components/Dashboard/TrackingPage";
import FeedbackPage              from "./Components/public/FeedbackPage";

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
