import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportForm from './components/ReportForm';
import TicketList from './components/TicketList';
import MapView from './components/MapView';
import IssueDetail from './components/IssueDetail';

function App() {
  return (
    <div className="min-h-screen">
      <div className="flex justify-center pb-8 pt-8 px-4 h-screen items-center overflow-auto">
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
