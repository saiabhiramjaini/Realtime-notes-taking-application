import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotesApp from './NotesApp'; // Adjust the path as necessary


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/room/:roomId" element={<NotesApp />} />
      </Routes>
    </Router>
  );
};

export default App;
