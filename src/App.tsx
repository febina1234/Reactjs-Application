import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import ListItems from './components/ListItems';
import CreateItem from './components/CreateItem';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          {/* Redirect the root path to /list-items */}
          <Route path="/" element={<Navigate to="/list-items" replace />} />
          <Route path="/list-items" element={<ListItems />} />
          <Route path="/create-item" element={<CreateItem />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
