import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AppLayout from "./layout/appLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import IncomeListPage from "./pages/IncomeListPage";
import IncomeCreatePage from "./pages/IncomeCreatePage";
import IncomeEditPage from "./pages/IncomeEditPage";
import OutcomeListPage from "./pages/OutcomeListPage";
import OutcomeCreatePage from "./pages/OutcomeCreatePage";
import OutcomeEditPage from "./pages/OutcomeEditPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/income" element={<IncomeListPage />} />
        <Route path="/income/create" element={<IncomeCreatePage />} />
        <Route path="/income/edit/:id" element={<IncomeEditPage />} />
        <Route path="/outcome" element={<OutcomeListPage />} />
        <Route path="/outcome/create" element={<OutcomeCreatePage />} />
        <Route path="/outcome/edit/:id" element={<OutcomeEditPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
