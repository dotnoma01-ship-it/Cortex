import "./admin.css";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { AdminGate, AdminLogin } from "./AdminLogin";
export default function AdminApp() {
  return <Routes>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminGate><AdminLayout /></AdminGate>} />
    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>;
}