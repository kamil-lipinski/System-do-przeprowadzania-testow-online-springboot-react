import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './zaloguj-zarejestruj.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';

function Register() {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [czyNauczyciel, setCzyNauczyciel] = useState(false);
  const [error, setError] = useState('');
  // const [msg, setMsg] = useState('');
  
  
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

    if (!imie || !nazwisko || !email || !haslo) {
      toast.error("Wszystkie pola nie zostały wypełnione...", {
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
      return;
    }

    fetch('http://localhost:8080/auth/zarejestruj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imie: imie,
        nazwisko: nazwisko,
        email: email,
        haslo: haslo,
        czyNauczyciel: czyNauczyciel,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          toast.success(data.message, {
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
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <label>
        Imię
        <input
          type="text"
          value={imie}
          onChange={(event) => setImie(event.target.value)}
        />
      </label>
      <br />
      <label>
        Nazwisko
        <input
          type="text"
          value={nazwisko}
          onChange={(event) => setNazwisko(event.target.value)}
        />
      </label>
      <br />
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
      <label>
        Nauczyciel
        <input
          type="checkbox"
          checked={czyNauczyciel}
          onChange={(event) => setCzyNauczyciel(event.target.checked)}
        />
      </label>
      <br />
      <button type="submit">Zarejestruj</button>
      <div className="link-container">
        <Link to="/" style={{ color: '#2a71ce' }}>Zaloguj się</Link>
      </div>
    </form>
  );
}

export default Register;
