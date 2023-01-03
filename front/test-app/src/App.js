import React from 'react';
import Zaloguj from './components/Zaloguj';
import Zarejestruj from './components/Zarejestruj';
import NauczycielPule from './components/Nauczyciel/NauczycielPule';
import NauczycielTesty from './components/Nauczyciel/NauczycielTesty';
import Uczen from './components/Uczen/Uczen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Zaloguj />} />
        <Route path="/zarejestruj" element={<Zarejestruj />} />
        <Route path="/nauczyciel-pule" element={<NauczycielPule />} />
        <Route path="/nauczyciel-testy" element={<NauczycielTesty />} />
				<Route path="/uczen" element={<Uczen />} />
      </Routes>
    </Router>
  );
}

export default App;
