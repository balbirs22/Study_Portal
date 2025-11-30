// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// ----- Public pages (no login) -----
import YearSelectionPage from "@/features/years/pages/YearSelectionPage";
import YearCoursesPage from "@/features/courses/pages/YearCoursesPage";
import CourseMaterialsPage from "@/features/materials/pages/CourseMaterialsPage";

// ----- Admin pages -----
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import ManageBranchesPage from "@/features/admin/pages/ManageBranchesPage";
import ManageYearsPage from "@/features/admin/pages/ManageYearsPage";
import ManageSubjectsPage from "@/features/admin/pages/ManageSubjectsPage";
import ManageMaterialsPage from "@/features/admin/pages/ManageMaterialsPage";

import AdminRoute from "./AdminRoute";

// Simple 404 page
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        404 — Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Check the URL or go
        back to the study portal.
      </p>
      <a
        href="/"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
      >
        Go to Year Selection
      </a>
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      {/* ---------- Public routes ---------- */}
      {/* Treat year selection as your "home" */}
      <Route path="/" element={<YearSelectionPage />} />
      <Route path="/years" element={<YearSelectionPage />} />

      {/* Courses for a year (you can use query params / context inside) */}
      <Route path="/courses" element={<YearCoursesPage />} />

      {/* Materials for a subject/course */}
      <Route path="/materials" element={<CourseMaterialsPage />} />

      {/* ---------- Admin auth ---------- */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ---------- Protected admin area ---------- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="branches" element={<ManageBranchesPage />} />
        <Route path="years" element={<ManageYearsPage />} />
        <Route path="subjects" element={<ManageSubjectsPage />} />
        <Route path="materials" element={<ManageMaterialsPage />} />
      </Route>

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
