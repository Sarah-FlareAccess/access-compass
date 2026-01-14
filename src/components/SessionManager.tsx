// ============================================
// ACCESS COMPASS - SESSION MANAGER
// ============================================
// Handles session timeout for authenticated users
// ============================================

import { useSessionTimeout, SessionTimeoutWarning } from '../hooks/useSessionTimeout';
import { useAuth } from '../contexts/AuthContext';
import '../styles/admin-panel.css';

interface SessionManagerProps {
  children: React.ReactNode;
}

export function SessionManager({ children }: SessionManagerProps) {
  const { signOut, isAuthenticated } = useAuth();

  const {
    isWarningVisible,
    remainingSeconds,
    extendSession,
  } = useSessionTimeout({
    enabled: isAuthenticated,
    warningMinutes: 5,
  });

  return (
    <>
      {children}

      {isWarningVisible && (
        <SessionTimeoutWarning
          remainingSeconds={remainingSeconds}
          onExtend={extendSession}
          onLogout={signOut}
        />
      )}
    </>
  );
}
