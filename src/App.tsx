import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Disclaimer from './pages/Disclaimer';
import BusinessSnapshot from './pages/BusinessSnapshot';
import Discovery from './pages/Discovery';
import ModuleSelection from './pages/ModuleSelection';
import DiscoveryQuestions from './pages/DiscoveryQuestions';
import Constraints from './pages/Constraints';
import Dashboard from './pages/Dashboard';
import ActionDetail from './pages/ActionDetail';
import DIAPWorkspace from './pages/DIAPWorkspace';
import ClarifyLater from './pages/ClarifyLater';
import Export from './pages/Export';
import SupabaseTest from './pages/SupabaseTest';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages without global nav (entry/onboarding) */}
        <Route path="/" element={<Landing />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* All other pages with global nav */}
        <Route element={<AppLayout />}>
          <Route path="/start" element={<BusinessSnapshot />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/modules" element={<ModuleSelection />} />
          <Route path="/questions" element={<DiscoveryQuestions />} />
          <Route path="/constraints" element={<Constraints />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/action/:id" element={<ActionDetail />} />
          <Route path="/diap" element={<DIAPWorkspace />} />
          <Route path="/clarify" element={<ClarifyLater />} />
          <Route path="/export" element={<Export />} />
          <Route path="/test-supabase" element={<SupabaseTest />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
