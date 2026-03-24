import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionManager } from './components/SessionManager';
import AppLayout from './components/AppLayout';
import { RouteGuard } from './components/guards/RouteGuard';
import { ScrollToTop } from './components/ScrollToTop';
import { PageLoader } from './components/PageLoader';

import './styles/global.css';

// Public pages
const Landing = lazy(() => import('./pages/Landing'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Login = lazy(() => import('./pages/Login'));

// Discovery flow
const BusinessSnapshot = lazy(() => import('./pages/BusinessSnapshot'));
const Discovery = lazy(() => import('./pages/Discovery'));
const DiscoverySummary = lazy(() => import('./pages/DiscoverySummary'));
const DiscoveryHelp = lazy(() => import('./pages/DiscoveryHelp'));

// Paywall / Auth pages
const Decision = lazy(() => import('./pages/Decision'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Protected pages
const ModuleSelection = lazy(() => import('./pages/ModuleSelection'));
const DiscoveryQuestions = lazy(() => import('./pages/DiscoveryQuestions'));
const Constraints = lazy(() => import('./pages/Constraints'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ActionDetail = lazy(() => import('./pages/ActionDetail'));
const DIAPWorkspace = lazy(() => import('./pages/DIAPWorkspace'));
const ClarifyLater = lazy(() => import('./pages/ClarifyLater'));
const ReportPage = lazy(() => import('./pages/ReportPage'));

// Dev/test pages
const SupabaseTest = lazy(() => import('./pages/SupabaseTest'));

// Resource Centre
const ResourceCentre = lazy(() => import('./pages/ResourceCentre'));

// Training Hub
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const LessonView = lazy(() => import('./pages/LessonView'));
const TrainingResourceDetail = lazy(() => import('./pages/TrainingResourceDetail'));

function App() {
  return (
    <AuthProvider>
      <SessionManager>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Auth callback (handles OAuth redirects - no nav needed) */}
          <Route path="/auth/callback" element={<Suspense fallback={<PageLoader />}><AuthCallback /></Suspense>} />
          <Route path="/auth/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />

          {/* ============================================
              ALL PAGES WITH NAVBAR
              ============================================ */}
          <Route element={<AppLayout />}>
            {/* Public pages */}
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
            <Route path="/disclaimer" element={<Suspense fallback={<PageLoader />}><Disclaimer /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/start" element={<Suspense fallback={<PageLoader />}><BusinessSnapshot /></Suspense>} />

            {/* Discovery */}
            <Route path="/discovery" element={<Suspense fallback={<PageLoader />}><Discovery /></Suspense>} />
            <Route path="/discovery/summary" element={<Suspense fallback={<PageLoader />}><DiscoverySummary /></Suspense>} />
            <Route path="/discovery/help" element={<Suspense fallback={<PageLoader />}><DiscoveryHelp /></Suspense>} />

            {/* Decision/paywall */}
            <Route path="/decision" element={<Suspense fallback={<PageLoader />}><Decision /></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><Checkout /></Suspense>} />
            <Route path="/checkout/success" element={<Suspense fallback={<PageLoader />}><CheckoutSuccess /></Suspense>} />

            {/* Resource Centre */}
            <Route path="/resources" element={<Suspense fallback={<PageLoader />}><ResourceCentre /></Suspense>} />

            {/* Training Hub */}
            <Route path="/training" element={<Suspense fallback={<PageLoader />}><TrainingHub /></Suspense>} />
            <Route path="/training/course/:slug" element={<Suspense fallback={<PageLoader />}><CourseDetail /></Suspense>} />
            <Route path="/training/course/:slug/lesson/:lessonId" element={<Suspense fallback={<PageLoader />}><LessonView /></Suspense>} />
            <Route path="/training/resource/:slug" element={<Suspense fallback={<PageLoader />}><TrainingResourceDetail /></Suspense>} />

            {/* Protected routes (require auth + pulse access) */}
            <Route
              path="/modules"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><ModuleSelection /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/questions"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><DiscoveryQuestions /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/constraints"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><Constraints /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/action/:id"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><ActionDetail /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/clarify"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><ClarifyLater /></Suspense>
                </RouteGuard>
              }
            />
            <Route path="/export" element={<Navigate to="/report" replace />} />
            <Route
              path="/report"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><ReportPage /></Suspense>
                </RouteGuard>
              }
            />

            {/* Deep Dive only */}
            <Route
              path="/diap"
              element={
                <RouteGuard requireAuth requireAccess="deep_dive">
                  <Suspense fallback={<PageLoader />}><DIAPWorkspace /></Suspense>
                </RouteGuard>
              }
            />

            {/* Dev/test */}
            <Route path="/test-supabase" element={<Suspense fallback={<PageLoader />}><SupabaseTest /></Suspense>} />
          </Route>
          </Routes>
        </Router>
      </SessionManager>
    </AuthProvider>
  );
}

export default App;
