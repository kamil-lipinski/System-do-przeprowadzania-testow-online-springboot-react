import React from 'react';
import Zaloguj from './components/Zaloguj';
import Zarejestruj from './components/Zarejestruj';
import NauczycielPule from './components/Nauczyciel/NauczycielPule';
import WyswietlPytania from './components/Nauczyciel/WyswietlPytania';
import NauczycielTestyZaplanowane from './components/Nauczyciel/NauczycielTestyZaplanowane';
import NauczycielTestyTrwajace from './components/Nauczyciel/NauczycielTestyTrwajace';
import NauczycielTestyZakonczone from './components/Nauczyciel/NauczycielTestyZakonczone';
import UczenTestyZaplanowane from './components/Uczen/UczenTestyZaplanowane';
import UczenTestyTrwajace from './components/Uczen/UczenTestyTrwajace';
import UczenTestyZakonczone from './components/Uczen/UczenTestyZakonczone';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Zaloguj />} />
        <Route path="/zarejestruj" element={<Zarejestruj />} />

        <Route path="/nauczyciel-pule" element={<NauczycielPule />} />
        <Route path="/wyswietl-pytania" element={<WyswietlPytania />} />

        <Route path="/nauczyciel-testy/zaplanowane" element={<NauczycielTestyZaplanowane />} />
        <Route path="/nauczyciel-testy/trwajace" element={<NauczycielTestyTrwajace />} />
        <Route path="/nauczyciel-testy/zakonczone" element={<NauczycielTestyZakonczone />} />
        
				<Route path="/uczen-testy/zaplanowane" element={<UczenTestyZaplanowane />} />
        <Route path="/uczen-testy/trwajace" element={<UczenTestyTrwajace />} />
        <Route path="/uczen-testy/zakonczone" element={<UczenTestyZakonczone />} />
      </Routes>
    </Router>
  );
}

export default App;
