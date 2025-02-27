import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm } from "../pages/Login";
import { SignupForm } from "../pages/Register";
import { ForgotPinForm } from "../pages/ForgotPin";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import SendMoney from "../pages/SendMoney";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-pin" element={<ForgotPinForm />} />

        <Route element={<AppLayout />}>
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route index path="/sendMoney" element={<SendMoney />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
