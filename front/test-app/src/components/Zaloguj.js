import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './zaloguj-zarejestruj.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');

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

  function handleSubmit(event) {
    event.preventDefault();

    if (!haslo || !email ) {
      showError("Wszystkie pola nie zostały wypełnione");
      return;
    }

    const transformedEmail = email.toLocaleLowerCase();

    axios.post('http://localhost:8080/auth/zaloguj', { email: transformedEmail, haslo: haslo }, {})
    .then(response => {
      if (response.status === 200 ) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('czyNauczyciel', response.data.czyNauczyciel);
        if (localStorage.czyNauczyciel === 'true') {
          window.location.href = '/nauczyciel-pule';
        } else {
          window.location.href = '/uczen-testy/zaplanowane';
        }
      }
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  }

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <form className="custom-form" onSubmit={handleSubmit}>
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
          <button className="custom-button" type="submit">Zaloguj</button>
          <div className="link-container">
            <Link to="/zarejestruj" style={{ color: '#2a71ce' }}>Zarejestruj się</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
