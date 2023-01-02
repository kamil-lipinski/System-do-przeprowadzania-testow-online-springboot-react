import React from 'react';
import Zaloguj from './components/Zaloguj';
import Zarejestruj from './components/Zarejestruj';
import Nauczyciel from './components/Nauczyciel/Nauczyciel';
import Uczen from './components/Uczen/Uczen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Zaloguj />} />
        <Route path="/zarejestruj" element={<Zarejestruj />} />
        <Route path="/nauczyciel" element={<Nauczyciel />} />
				<Route path="/uczen" element={<Uczen />} />
      </Routes>
    </Router>
  );
}

export default App;
