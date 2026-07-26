import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
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
    <>
      <Navbar />
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income/create"
          element={
            <ProtectedRoute>
              <IncomeCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income/edit/:id"
          element={
            <ProtectedRoute>
              <IncomeEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/outcome"
          element={
            <ProtectedRoute>
              <OutcomeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outcome/create"
          element={
            <ProtectedRoute>
              <OutcomeCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outcome/edit/:id"
          element={
            <ProtectedRoute>
              <OutcomeEditPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;