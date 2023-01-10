import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Nauczyciel/testybutton.css';

function TestyButton() {
    const location = useLocation();
    const trwajaceActive = location.pathname === '/uczen-testy/trwajace';
    const zaplanowaneActive = location.pathname === '/uczen-testy/zaplanowane';
    const zakonczoneActive = location.pathname === '/uczen-testy/zakonczone';

    return (
        <div className="testy-button">
            <button className={zaplanowaneActive ? 'active' : ''} onClick={() => window.location.href = '/uczen-testy/zaplanowane'}>Zaplanowane</button>
            <button className={trwajaceActive ? 'active' : ''} onClick={() => window.location.href = '/uczen-testy/trwajace'}>Trwające</button>
            <button className={zakonczoneActive ? 'active' : ''} onClick={() => window.location.href = '/uczen-testy/zakonczone'}>Zakończone</button>
        </div>
    );
  }
  
  export default TestyButton;
