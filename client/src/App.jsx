import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import AdminApprovals from './pages/AdminApprovals';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Properties />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/properties" element={<Properties />} />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute>
            <AdminApprovals />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;