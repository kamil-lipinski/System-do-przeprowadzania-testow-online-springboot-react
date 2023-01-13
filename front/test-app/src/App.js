import React from 'react';
import Zaloguj from './components/Zaloguj';
import Zarejestruj from './components/Zarejestruj';
import NauczycielPule from './components/Nauczyciel/NauczycielPule';
import WyswietlPytania from './components/Nauczyciel/WyswietlPytania';
import NauczycielTestyZaplanowane from './components/Nauczyciel/NauczycielTestyZaplanowane';
import NauczycielTestyTrwajace from './components/Nauczyciel/NauczycielTestyTrwajace';
import NauczycielTestyZakonczone from './components/Nauczyciel/NauczycielTestyZakonczone';
import NauczycielWyniki from './components/Nauczyciel/NauczycielWyniki';
import NauczycielWyniki2 from './components/Nauczyciel/NauczycielWyniki2';
import UczenTestyZaplanowane from './components/Uczen/UczenTestyZaplanowane';
import UczenTestyTrwajace from './components/Uczen/UczenTestyTrwajace';
import UczenTestyZakonczone from './components/Uczen/UczenTestyZakonczone';
import UczenWyswietlTest from './components/Uczen/UczenWyswietlTest';
import UczenWyniki from './components/Uczen/UczenWyniki';
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

        <Route path="/nauczyciel-wyniki" element={<NauczycielWyniki />} />
        <Route path="/nauczyciel-wyniki2" element={<NauczycielWyniki2 />} />
        
				<Route path="/uczen-testy/zaplanowane" element={<UczenTestyZaplanowane />} />
        <Route path="/uczen-testy/trwajace" element={<UczenTestyTrwajace />} />
        <Route path="/uczen-testy/zakonczone" element={<UczenTestyZakonczone />} />

        <Route path="/uczen-wyniki" element={<UczenWyniki />} />

        <Route path="/wyswietl-test" element={<UczenWyswietlTest />} />
      </Routes>
    </Router>
  );
}

export default App;
