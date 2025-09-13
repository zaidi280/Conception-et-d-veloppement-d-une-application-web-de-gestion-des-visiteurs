import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

// Import authentication components
import { AuthProvider } from './contexts/AuthContext';
import { DateRangeProvider } from './contexts/DateRangeContext';
import Login from './components/authentification/Login';
import Logout from './components/authentification/Logout';
import Dashboard from './components/Dashboard';
import Visiteurs from './components/Visiteurs/Visiteurs';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DateRangeProvider>
          <Router>
            <div>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/visiteurs"
                  element={
                    <ProtectedRoute>
                      <Visiteurs />
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route
                  path="/"
                  element={<Navigate to="/login" replace />}
                />

                {/* Catch all route - redirect to login */}
                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            </div>
          </Router>
        </DateRangeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App
