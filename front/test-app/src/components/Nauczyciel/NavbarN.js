import React from 'react';
import { useLocation } from 'react-router-dom';
import '../navbar.css';
import { TbLogout } from 'react-icons/tb';

function NavbarN() {
    const location = useLocation();
    const pulePytanActive = location.pathname === '/nauczyciel-pule' || location.pathname === '/wyswietl-pytania/';
    const testyActive = location.pathname === '/nauczyciel-testy/zaplanowane' || location.pathname === '/nauczyciel-testy/trwajace' || location.pathname === '/nauczyciel-testy/zakonczone';
    const wynikiActive = location.pathname === '/nauczyciel-wyniki' || location.pathname === '/nauczyciel-wyniki2/';

    return (
      <nav className="custom-navbar">
        <div className="left-side">
          <button className={pulePytanActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-pule'}>Pule pytań</button>
          <button className={testyActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-testy/zaplanowane'}>Testy</button>
          <button className={wynikiActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-wyniki'}>Wyniki</button>
        </div>
        <div className="right-side">
          <button onClick={() => {window.location.href = '/'; localStorage.clear()}}>Wyloguj  <TbLogout size={23} style={{ stroke: "white", strokeWidth: "2"}}/></button>
        </div>
      </nav>
    );
  }
  
  export default NavbarN;
