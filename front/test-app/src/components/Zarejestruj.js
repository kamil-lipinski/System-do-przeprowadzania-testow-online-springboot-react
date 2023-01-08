import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './zaloguj-zarejestruj.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import axios from 'axios';

function Register() {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  const [haslo2, setHaslo2] = useState('');
  const [czyNauczyciel, setCzyNauczyciel] = useState(false);

  const showError = message => {
    toast.error(message, {
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
  };

  const showSucces = message => {
    toast.success(message, {
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
  };

  function handleSubmit(event) {
    event.preventDefault();

    if (!imie || !nazwisko || !email || !haslo || !haslo2) {
      showError("Wszystkie pola nie zostały wypełnione");
      return;
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(haslo)) {
      showError("Hasło może zawierać tylko litery i liczby");
      return;
    }

    if (haslo !== haslo2) {
      showError("Hasła nie są takie same");
      return;
    }

    const transformedImie = imie.charAt(0).toUpperCase() + imie.slice(1);
    const transformedNazwisko = nazwisko.charAt(0).toUpperCase() + nazwisko.slice(1);
    const transformedEmail = email.toLocaleLowerCase();

    axios.post('http://localhost:8080/auth/zarejestruj', { imie: transformedImie, 
                                                          nazwisko: transformedNazwisko,
                                                          email: transformedEmail,
                                                          haslo: haslo,
                                                          czyNauczyciel: czyNauczyciel, 
                                                        }, {})
    .then(response => {
      if (response.status === 200 ) {
        showSucces(response.data.message);
      }
    })
    .catch(error => {
      showError(error.response.data.message);
    });
    setImie("");
    setNazwisko("");
    setEmail("");
    setHaslo("");
    setHaslo2("");
    setCzyNauczyciel(false);
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
