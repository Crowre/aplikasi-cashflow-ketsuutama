import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const AppLayout = lazy(() => import("./layout/AppLayout"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const IncomeListPage = lazy(() => import("./pages/IncomeListPage"));
const IncomeCreatePage = lazy(() => import("./pages/IncomeCreatePage"));
const IncomeEditPage = lazy(() => import("./pages/IncomeEditPage"));
const OutcomeListPage = lazy(() => import("./pages/OutcomeListPage"));
const OutcomeCreatePage = lazy(() => import("./pages/OutcomeCreatePage"));
const OutcomeEditPage = lazy(() => import("./pages/OutcomeEditPage"));

function App() {
  return (
    <Suspense fallback={<p role="status">Memuat halaman...</p>}>
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
    </Suspense>
  );
}

export default App;
