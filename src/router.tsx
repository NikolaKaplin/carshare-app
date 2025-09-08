import { Route, Routes } from "react-router";
import DashboardLayout from "./layouts/dashboard-layout";
import AuthLayout from "./layouts/auth-layout";
import TestPage from "./pages/TestPage";
import AuthPage from "./pages/AuthPage";
import CarsPage from "./pages/CarsPage";
import ClientsPage from "./pages/ClientsPage";
import PaymentsPage from "./pages/PaymentsPage";
import RentsPage from "./pages/RentsPage";
import ImportExportPage from "./pages/SqlitePage";

function Routing() {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route element={<AuthLayout />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<TestPage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="rent" element={<RentsPage />} />
          <Route path="sqlite" element={<ImportExportPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Routing;
