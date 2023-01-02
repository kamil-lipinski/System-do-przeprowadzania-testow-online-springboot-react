import React from 'react';
import Login from './components/Login';
import Nauczyciel from './components/Nauczyciel/Nauczyciel';
import Uczen from './components/Uczen/Uczen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/nauczyciel" element={<Nauczyciel />} />
				<Route path="/uczen" element={<Uczen />} />
      </Routes>
    </Router>
  );
}

export default App;
