import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionManager } from './components/SessionManager';
import AppLayout from './components/AppLayout';
import { RouteGuard } from './components/guards/RouteGuard';
import { ScrollToTop } from './components/ScrollToTop';
import { PageLoader } from './components/PageLoader';

import './styles/global.css';

// Auto-reload on stale chunk errors after a new deploy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithRetry(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(() =>
    importFn().catch(() => {
      const hasReloaded = sessionStorage.getItem('chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload', '1');
        window.location.reload();
      }
      return importFn();
    })
  );
}

// Public pages
const Landing = lazyWithRetry(() => import('./pages/Landing'));
const Disclaimer = lazyWithRetry(() => import('./pages/Disclaimer'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Pricing = lazyWithRetry(() => import('./pages/Pricing'));

// Discovery flow
const BusinessSnapshot = lazyWithRetry(() => import('./pages/BusinessSnapshot'));
const Discovery = lazyWithRetry(() => import('./pages/Discovery'));
const DiscoverySummary = lazyWithRetry(() => import('./pages/DiscoverySummary'));
const DiscoveryHelp = lazyWithRetry(() => import('./pages/DiscoveryHelp'));

// Paywall / Auth pages
const Decision = lazyWithRetry(() => import('./pages/Decision'));
const Checkout = lazyWithRetry(() => import('./pages/Checkout'));
const CheckoutSuccess = lazyWithRetry(() => import('./pages/CheckoutSuccess'));
const AuthCallback = lazyWithRetry(() => import('./pages/AuthCallback'));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword'));

// Protected pages
const ModuleSelection = lazyWithRetry(() => import('./pages/ModuleSelection'));
const DiscoveryQuestions = lazyWithRetry(() => import('./pages/DiscoveryQuestions'));
const Constraints = lazyWithRetry(() => import('./pages/Constraints'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const ActionDetail = lazyWithRetry(() => import('./pages/ActionDetail'));
const DIAPWorkspace = lazyWithRetry(() => import('./pages/DIAPWorkspace'));
const ClarifyLater = lazyWithRetry(() => import('./pages/ClarifyLater'));
const ReportPage = lazyWithRetry(() => import('./pages/ReportPage'));

// Static pages
const AccessibilityStatement = lazyWithRetry(() => import('./pages/AccessibilityStatement'));

// Dev/test pages
const SupabaseTest = lazyWithRetry(() => import('./pages/SupabaseTest'));

// Resource Centre
const ResourceCentre = lazyWithRetry(() => import('./pages/ResourceCentre'));

// Training Hub
const TrainingHub = lazyWithRetry(() => import('./pages/TrainingHub'));
const CourseDetail = lazyWithRetry(() => import('./pages/CourseDetail'));
const LessonView = lazyWithRetry(() => import('./pages/LessonView'));
const TrainingResourceDetail = lazyWithRetry(() => import('./pages/TrainingResourceDetail'));

// Authority Portal
const AuthorityDashboard = lazyWithRetry(() => import('./pages/AuthorityDashboard'));
const AuthorityPrograms = lazyWithRetry(() => import('./pages/AuthorityPrograms'));
const AuthorityProgramDetail = lazyWithRetry(() => import('./pages/AuthorityProgramDetail'));
const AuthorityBusinesses = lazyWithRetry(() => import('./pages/AuthorityBusinesses'));
const AuthorityGuidance = lazyWithRetry(() => import('./pages/AuthorityGuidance'));
const ProgramEnrol = lazyWithRetry(() => import('./pages/ProgramEnrol'));

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
            <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><Pricing /></Suspense>} />
            <Route path="/accessibility" element={<Suspense fallback={<PageLoader />}><AccessibilityStatement /></Suspense>} />
            <Route path="/start" element={<Suspense fallback={<PageLoader />}><BusinessSnapshot /></Suspense>} />

            {/* Discovery */}
            <Route path="/discovery" element={<Suspense fallback={<PageLoader />}><Discovery /></Suspense>} />
            <Route path="/discovery/summary" element={<Suspense fallback={<PageLoader />}><DiscoverySummary /></Suspense>} />
            <Route path="/discovery/help" element={<Suspense fallback={<PageLoader />}><DiscoveryHelp /></Suspense>} />

            {/* Decision/paywall */}
            <Route path="/decision" element={<Suspense fallback={<PageLoader />}><Decision /></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><Checkout /></Suspense>} />
            <Route path="/checkout/success" element={<Suspense fallback={<PageLoader />}><CheckoutSuccess /></Suspense>} />

            {/* Program enrolment (public) */}
            <Route path="/enrol/:slug" element={<Suspense fallback={<PageLoader />}><ProgramEnrol /></Suspense>} />

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
                  <Suspense fallback={<PageLoader />}><Dashboard view="overview" /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/assessment"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><Dashboard view="modules" /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/evidence"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><Dashboard view="evidence" /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/activity"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Suspense fallback={<PageLoader />}><Dashboard view="activity" /></Suspense>
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

            {/* Authority Portal (requires auth) */}
            <Route
              path="/authority"
              element={
                <RouteGuard requireAuth>
                  <Suspense fallback={<PageLoader />}><AuthorityDashboard /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/authority/programs"
              element={
                <RouteGuard requireAuth>
                  <Suspense fallback={<PageLoader />}><AuthorityPrograms /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/authority/programs/:id"
              element={
                <RouteGuard requireAuth>
                  <Suspense fallback={<PageLoader />}><AuthorityProgramDetail /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/authority/businesses"
              element={
                <RouteGuard requireAuth>
                  <Suspense fallback={<PageLoader />}><AuthorityBusinesses /></Suspense>
                </RouteGuard>
              }
            />
            <Route
              path="/authority/guidance"
              element={
                <RouteGuard requireAuth>
                  <Suspense fallback={<PageLoader />}><AuthorityGuidance /></Suspense>
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
