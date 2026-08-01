import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AdminApprovals from './pages/AdminApprovals';
import MyBookings from './pages/MyBookings';
import CreateListing from './pages/CreateListing';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
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
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute>
              <AdminApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/create"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;