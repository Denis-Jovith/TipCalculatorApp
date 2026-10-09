import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AllProjects from './pages/AllProjects.jsx';
import AllAchievements from './pages/AllAchievements.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AchievementDetail from './pages/AchievementDetail.jsx';
import Links from './pages/Links.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin (Tiptap editor + CMS screens) is code-split out of the public bundle —
// visitors browsing the portfolio never pay for it.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AcceptInvite = lazy(() => import('./pages/admin/AcceptInvite.jsx'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements.jsx'));
const AdminRecommendations = lazy(() => import('./pages/admin/AdminRecommendations.jsx'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments.jsx'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills.jsx'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience.jsx'));
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation.jsx'));
const AdminSocial = lazy(() => import('./pages/admin/AdminSocial.jsx'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] text-brand-teal">Loading admin…</div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<AllProjects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/achievements" element={<AllAchievements />} />
      <Route path="/achievements/:slug" element={<AchievementDetail />} />
      <Route path="/links" element={<Links />} />

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin/accept-invite"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AcceptInvite />
          </Suspense>
        }
      />
      <Route
        path="/admin/forgot-password"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route
        path="/admin/reset-password"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ResetPassword />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="recommendations" element={<AdminRecommendations />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="education" element={<AdminEducation />} />
        <Route path="social" element={<AdminSocial />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
