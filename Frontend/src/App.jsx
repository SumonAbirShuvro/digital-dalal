import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Login from "./Components/Auth/Login"; 
import Register from "./Components/Auth/Register"; 

import OTPVerification from "./Components/Auth/OTPVerification";
import VerificationCode from "./Components/Auth/VerificationCode";
import SuccessPage from "./Components/Auth/SuccessPage";
import CitizenDashboard from "./Components/Dashboard/CitizenDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Root - redirect based on auth */}
                <Route 
                    path="/" 
                    element={
                        isAuthenticated() 
                            ? <Navigate to="/dashboard" /> 
                            : <Navigate to="/login" />
                    } 
                />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/otp-verification" element={<OTPVerification />} />
                <Route path="/verification-code" element={<VerificationCode />} />
                <Route path="/success" element={<SuccessPage />} />
                
                {/* Protected Dashboard Route */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <CitizenDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;