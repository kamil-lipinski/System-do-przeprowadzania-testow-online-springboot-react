import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './zaloguj-zarejestruj.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [error, setError] = useState('');
  
  const notify = useCallback(() => {
    toast.error(error, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Flip,
    });
  }, [error]);

  useEffect(() => {
    if (error) {
      notify();
    }
  }, [error, notify]);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:8080/auth/zaloguj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        haslo: haslo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('czyNauczyciel', data.czyNauczyciel);
          if (localStorage.czyNauczyciel === 'true') {
            window.location.href = '/Nauczyciel';
          } else {
            window.location.href = '/Uczen';
          }
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <br />
      <label>
        Hasło
        <input
          type="password"
          value={haslo}
          onChange={(event) => setHaslo(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Zaloguj</button>
      <div className="link-container">
        <Link to="/zarejestruj" style={{ color: '#2a71ce' }}>Zarejestruj się</Link>
      </div>
    </form>
  );
}

export default Login;
