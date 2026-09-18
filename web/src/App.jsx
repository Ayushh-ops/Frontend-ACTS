import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import TicketList from './components/TicketList';
import MapView from './components/MapView';
import IssueDetail from './components/IssueDetail';

function App() {
  return (
    <div className="min-h-screen">
      {/* Temporary Navigation for ease of testing */}
      <nav className="bg-white p-4 shadow mb-4 flex gap-4 flex-wrap justify-center font-bold text-acts-admin">
        <Link to="/" className="hover:text-acts-teal">1. Report Issue</Link>
        <Link to="/admin" className="hover:text-acts-teal">2. Admin Ticket List</Link>
        <Link to="/map" className="hover:text-acts-teal">3. Common Map</Link>
        <Link to="/issue/4092" className="hover:text-acts-teal">4. Issue Detail</Link>
      </nav>

      <div className="flex justify-center pb-8 p-4">
        <Routes>
          <Route path="/" element={<ReportForm />} />
          <Route path="/admin" element={<TicketList />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/issue/:id" element={<IssueDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
