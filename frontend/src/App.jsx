import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SafeRoute from "./pages/SafeRoute";
import ReportHazard from "./pages/ReportHazard";
import UnsafeLocation from "./pages/UnsafeLocation";
import SOS from "./pages/SOS";
import SafetyTips from "./pages/SafetyTips";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReports from "./pages/MyReports";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";



function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/safe-route" element={<SafeRoute />} />
        <Route path="/report-hazard" element={<ReportHazard />} />
        <Route path="/unsafe-location" element={<UnsafeLocation />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/safety-tips" element={<SafetyTips />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset-password"element={<ResetPassword />}/>
        <Route path="/admin/reports"element={<AdminReports />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;