import React, { useState } from 'react';
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
  const [haslo2, setHaslo2] = useState('');
  const [czyNauczyciel, setCzyNauczyciel] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!imie || !nazwisko || !email || !haslo || !haslo2) {
      toast.error("Wszystkie pola nie zostały wypełnione", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Flip,
      });
      return;
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(haslo)) {
      toast.error("Hasło może zawierać tylko litery i liczby", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Flip,
      });
      return;
    }

    if (haslo !== haslo2) {
      toast.error("Hasła nie są takie same", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        transition: Flip,
      });
      return;
    }

    const transformedImie = imie.charAt(0).toUpperCase() + imie.slice(1);
    const transformedNazwisko = nazwisko.charAt(0).toUpperCase() + nazwisko.slice(1);
    const transformedEmail = email.toLocaleLowerCase();

    fetch('http://localhost:8080/auth/zarejestruj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imie: transformedImie,
        nazwisko: transformedNazwisko,
        email: transformedEmail,
        haslo: haslo,
        czyNauczyciel: czyNauczyciel,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'colored',
            transition: Flip,
          });
        } else {
          toast.success(data.message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'colored',
            transition: Flip,
          });
        }
      });
  }

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <form className="custom-form" onSubmit={handleSubmit}>
          <label className="custom-label">
            Imię
            <input
              className="custom-input"
              type="text"
              value={imie}
              onChange={(event) => setImie(event.target.value)}
            />
          </label>
          <br />
          <label className="custom-label">
            Nazwisko
            <input
              className="custom-input"
              type="text"
              value={nazwisko}
              onChange={(event) => setNazwisko(event.target.value)}
            />
          </label>
          <br />
          <label className="custom-label">
            Email
            <input
              className="custom-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <br />
          <label className="custom-label">
            Hasło
            <input
              className="custom-input"
              type="password"
              value={haslo}
              onChange={(event) => setHaslo(event.target.value)}
            />
          </label>
          <br />
          <label className="custom-label">
            Powtórz hasło
            <input
              className="custom-input"
              type="password"
              value={haslo2}
              onChange={(event) => setHaslo2(event.target.value)}
            />
          </label>
          <br />
          <label class="checkbox-container">Nauczyciel
            <input
              className="custom-input"
              type="checkbox"
              checked={czyNauczyciel}
              onChange={(event) => setCzyNauczyciel(event.target.checked)}
            />
            <span class="checkmark"></span>
          </label>
          <br />
          <button class="custom-button" type="submit">Zarejestruj</button>
          <div className="link-container">
            <Link to="/" style={{ color: '#2a71ce' }}>Zaloguj się</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
