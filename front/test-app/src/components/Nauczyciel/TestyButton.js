import React from 'react';
import { useLocation } from 'react-router-dom';
import './testybutton.css';

function TestyButton() {
    const location = useLocation();
    const trwajaceActive = location.pathname === '/nauczyciel-testy/trwajace';
    const zaplanowaneActive = location.pathname === '/nauczyciel-testy/zaplanowane';
    const zakonczoneActive = location.pathname === '/nauczyciel-testy/zakonczone';

    return (
        <div className="testy-button">
            <button className={zaplanowaneActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-testy/zaplanowane'}>Zaplanowane</button>
            <button className={trwajaceActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-testy/trwajace'}>Trwające</button>
            <button className={zakonczoneActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-testy/zakonczone'}>Zakończone</button>
        </div>
    );
  }
  
  export default TestyButton;
