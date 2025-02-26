import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { LoginForm } from "../pages/Login";
import { SignupForm } from "../pages/Register";
import { ForgotPinForm } from "../pages/ForgotPin";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-pin" element={<ForgotPinForm />} />

        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route index path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
