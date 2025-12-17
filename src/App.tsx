import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import BusinessSnapshot from './pages/BusinessSnapshot';
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
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<BusinessSnapshot />} />
        <Route path="/modules" element={<ModuleSelection />} />
        <Route path="/questions" element={<DiscoveryQuestions />} />
        <Route path="/constraints" element={<Constraints />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/action/:id" element={<ActionDetail />} />
        <Route path="/diap" element={<DIAPWorkspace />} />
        <Route path="/clarify" element={<ClarifyLater />} />
        <Route path="/export" element={<Export />} />
        <Route path="/test-supabase" element={<SupabaseTest />} />
      </Routes>
    </Router>
  );
}

export default App;
