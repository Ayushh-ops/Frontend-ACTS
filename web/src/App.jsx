import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import TicketList from './components/TicketList';
import MapView from './components/MapView';
import IssueDetail from './components/IssueDetail';
import Login from './components/Login';
import MyIssues from './components/MyIssues';
import Notifications from './components/Notifications';
import { RoleProvider } from './context/RoleContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <RoleProvider>
      <div className="min-h-screen">
        <div className="flex justify-center pb-8 pt-8 px-4 h-screen items-center overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Citizen Routes */}
            <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
              <Route path="/report" element={<ReportForm />} />
              <Route path="/issues" element={<MyIssues />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<TicketList />} />
            </Route>

            {/* Common Routes */}
            <Route element={<ProtectedRoute allowedRoles={['citizen', 'admin']} />}>
              <Route path="/map" element={<MapView />} />
              <Route path="/issue/:id" element={<IssueDetail />} />
            </Route>
          </Routes>
        </div>
      </div>
    </RoleProvider>
  );
}

export default App;
