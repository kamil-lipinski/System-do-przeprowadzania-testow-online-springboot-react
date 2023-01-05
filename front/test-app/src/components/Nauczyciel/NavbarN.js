import React from 'react';
import { useLocation } from 'react-router-dom';
import './navbar.css';
import { TbLogout } from 'react-icons/tb';

function NavbarN() {
    const location = useLocation();
    const pulePytanActive = location.pathname === '/nauczyciel-pule';
    const testyActive = location.pathname === '/nauczyciel-testy';

    return (
      <nav className="custom-navbar">
        <div className="left-side">
          <button className={pulePytanActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-pule'}>Pule pytań</button>
          <button className={testyActive ? 'active' : ''} onClick={() => window.location.href = '/nauczyciel-testy'}>Testy</button>
        </div>
        <div className="right-side">
          <button onClick={() => window.location.href = '/'}>Wyloguj  <TbLogout size={23} style={{ stroke: "white", strokeWidth: "2"}}/></button>
        </div>
      </nav>
    );
  }
  
  export default NavbarN;
