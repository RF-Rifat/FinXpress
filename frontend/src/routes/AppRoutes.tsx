import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { LoginForm } from "../pages/Login";
import { SignupForm } from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import { ForgotPinForm } from "../pages/ForgotPin";
import { VerifyAccountForm } from "../pages/VerifyAccount";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-pin" element={<ForgotPinForm />} />
        <Route path="/verify-account" element={<VerifyAccountForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
