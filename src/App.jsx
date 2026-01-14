import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
