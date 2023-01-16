import React from 'react';
import { useLocation } from 'react-router-dom';
import '../navbar.css';
import { TbLogout } from 'react-icons/tb';

function NavbarU() {
    const location = useLocation();
    const testyActive = location.pathname === '/uczen-testy/zaplanowane' || 
                        location.pathname === '/uczen-testy/trwajace' || 
                        location.pathname === '/uczen-testy/zakonczone' ||
                        location.pathname === '/wyswietl-test/';
    const wynikiActive = location.pathname === '/uczen-wyniki';

    return (
      <nav className="custom-navbar">
        <div className="left-side">
          <button className={testyActive ? 'active' : ''} onClick={() => window.location.href = '/uczen-testy/zaplanowane'}>Testy</button>
          <button className={wynikiActive ? 'active' : ''} onClick={() => window.location.href = '/uczen-wyniki'}>Wyniki</button>
        </div>
        <div className="right-side">
          <button onClick={() => {window.location.href = '/'; localStorage.clear()}}>Wyloguj  <TbLogout size={23} style={{ stroke: "white", strokeWidth: "2"}}/></button>
        </div>
      </nav>
    );
  }
  
  export default NavbarU;
