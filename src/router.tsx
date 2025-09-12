import { Route, Routes } from "react-router";
import DashboardLayout from "./layouts/dashboard-layout";
import AuthLayout from "./layouts/auth-layout";
import AuthPage from "./pages/AuthPage";
import CarsPage from "./pages/CarsPage";
import ClientsPage from "./pages/ClientsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ImportExportPage from "./pages/SqlitePage";
import RootLayout from "./layouts/root-layout";
import MaintenancePage from "./pages/MaintenancePage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";

function Routing() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="auth" element={<AuthPage />} />
        <Route element={<AuthLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="cars" element={<CarsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="sqlite" element={<ImportExportPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default Routing;
