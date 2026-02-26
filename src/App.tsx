import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionManager } from './components/SessionManager';
import AppLayout from './components/AppLayout';
import { RouteGuard } from './components/guards/RouteGuard';
import { ScrollToTop } from './components/ScrollToTop';

// Public pages
import Landing from './pages/Landing';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';

// Discovery flow (open to anonymous)
import BusinessSnapshot from './pages/BusinessSnapshot';
import Discovery from './pages/Discovery';
import DiscoverySummary from './pages/DiscoverySummary';
import DiscoveryHelp from './pages/DiscoveryHelp';

// Paywall / Auth pages
import Decision from './pages/Decision';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import AuthCallback from './pages/AuthCallback';
import ResetPassword from './pages/ResetPassword';

// Protected pages (require auth + access)
import ModuleSelection from './pages/ModuleSelection';
import DiscoveryQuestions from './pages/DiscoveryQuestions';
import Constraints from './pages/Constraints';
import Dashboard from './pages/Dashboard';
import ActionDetail from './pages/ActionDetail';
import DIAPWorkspace from './pages/DIAPWorkspace';
import ClarifyLater from './pages/ClarifyLater';
import Export from './pages/Export';

// Dev/test pages
import SupabaseTest from './pages/SupabaseTest';

// Resource Centre (publicly accessible)
import ResourceCentre from './pages/ResourceCentre';

// Training Hub (publicly browsable, content access gated per-item)
import TrainingHub from './pages/TrainingHub';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import TrainingResourceDetail from './pages/TrainingResourceDetail';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <SessionManager>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Auth callback (handles OAuth redirects - no nav needed) */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* ============================================
              ALL PAGES WITH NAVBAR
              ============================================ */}
          <Route element={<AppLayout />}>
            {/* Public pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/login" element={<Login />} />
            {/* Business snapshot - captures org info */}
            <Route path="/start" element={<BusinessSnapshot />} />

            {/* Discovery - touchpoints, calibration, pathway selection */}
            <Route path="/discovery" element={<Discovery />} />

            {/* Discovery Summary - for returning users to review/modify */}
            <Route path="/discovery/summary" element={<DiscoverySummary />} />

            {/* Discovery Help - FAQs and guidance for onboarding */}
            <Route path="/discovery/help" element={<DiscoveryHelp />} />

            {/* Decision/paywall page - handles auth internally */}
            <Route path="/decision" element={<Decision />} />

            {/* Checkout flow */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />

            {/* Resource Centre - publicly accessible */}
            <Route path="/resources" element={<ResourceCentre />} />

            {/* Training Hub - publicly browsable, content gated per-item */}
            <Route path="/training" element={<TrainingHub />} />
            <Route path="/training/course/:slug" element={<CourseDetail />} />
            <Route path="/training/course/:slug/lesson/:lessonId" element={<LessonView />} />
            <Route path="/training/resource/:slug" element={<TrainingResourceDetail />} />

            {/* ============================================
                PROTECTED ROUTES (require auth + pulse access)
                ============================================ */}
            <Route
              path="/modules"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <ModuleSelection />
                </RouteGuard>
              }
            />
            <Route
              path="/questions"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <DiscoveryQuestions />
                </RouteGuard>
              }
            />
            <Route
              path="/constraints"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Constraints />
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Dashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/action/:id"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <ActionDetail />
                </RouteGuard>
              }
            />
            <Route
              path="/clarify"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <ClarifyLater />
                </RouteGuard>
              }
            />
            <Route
              path="/export"
              element={
                <RouteGuard requireAuth requireAccess="pulse">
                  <Export />
                </RouteGuard>
              }
            />

            {/* ============================================
                DEEP DIVE ONLY (require deep_dive access)
                ============================================ */}
            <Route
              path="/diap"
              element={
                <RouteGuard requireAuth requireAccess="deep_dive">
                  <DIAPWorkspace />
                </RouteGuard>
              }
            />

            {/* ============================================
                DEV/TEST ROUTES
                ============================================ */}
            <Route path="/test-supabase" element={<SupabaseTest />} />
          </Route>
          </Routes>
        </Router>
      </SessionManager>
    </AuthProvider>
  );
}

export default App;
