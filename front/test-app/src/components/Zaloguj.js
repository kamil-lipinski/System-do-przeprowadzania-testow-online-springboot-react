import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './zaloguj-zarejestruj.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [haslo, setHaslo] = useState('');
  
  function handleSubmit(event) {
    event.preventDefault();

    if (!haslo || !email ) {
      toast.error("Wszystkie pola nie zostały wypełnione", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Flip,
      });
      return;
    }

    const transformedEmail = email.toLocaleLowerCase();

    fetch('http://localhost:8080/auth/zaloguj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: transformedEmail,
        haslo: haslo,
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
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Flip,
          });
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('czyNauczyciel', data.czyNauczyciel);
          if (localStorage.czyNauczyciel === 'true') {
            window.location.href = '/nauczyciel-pule';
          } else {
            window.location.href = '/uczen';
          }
        }
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
