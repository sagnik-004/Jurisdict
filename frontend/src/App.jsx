import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from "./components/landing/Landing";
import LawyerSigninSignup from "./components/signinsignup/LawyerSigninSignup";
import JudgeSigninSignup from "./components/signinsignup/JudgeSigninSignup";
import DetaineeSigninSignup from "./components/signinsignup/DetaineeSigninSignup";
import JudgeDashboard from "./components/dashboards/JudgeDashboard";
import LawyerDashboard from "./components/dashboards/LawyerDashboard";
import DetaineeDashboard from "./components/dashboards/DetaineeDashboard";
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage and update state
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser); 
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/l/register" element={<LawyerSigninSignup />} />
        <Route path="/j/register" element={<JudgeSigninSignup />} />
        <Route path="/d/register" element={<DetaineeSigninSignup />} />

        <Route path="/j/:username" element={<ProtectedRoute user={user}><JudgeDashboard /></ProtectedRoute>} />
        <Route path="/l/:username" element={<ProtectedRoute user={user}><LawyerDashboard /></ProtectedRoute>} />
        <Route path="/d/:username" element={<ProtectedRoute user={user}><DetaineeDashboard /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
};

export default App;