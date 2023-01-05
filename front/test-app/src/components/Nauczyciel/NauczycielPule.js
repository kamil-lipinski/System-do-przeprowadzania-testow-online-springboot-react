import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycielpule.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Popup from './Popup';

function NauczycielPule() {
  const [pulePytan, setPulePytan] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(pulePytan.length / 8);
  const [nazwa, setNazwa] = useState('');
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/pula/wyswietl_pule', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setPulePytan(data);
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8080/pula/usun_pule/?pulaID=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 403 ) {
      toast.error("Nie można usunąć puli z pytaniami z której trwają lub są zaplanowane testy", {
        position: 'bottom-right',
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
      const fetchData = async () => {
        const response = await fetch('http://localhost:8080/pula/wyswietl_pule', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setPulePytan(data);
      };
      fetchData();
      toast.success("Pomyślnie usunięto pulę", {
        position: 'bottom-right',
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
    setPopup2(false);
  };

  const handleClickStworz = async () => {
    const response = await fetch(`http://localhost:8080/pula/stworz_pule`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/pula/wyswietl_pule', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setPulePytan(data);
    };
    fetchData();
    if (response.status === 200 ) {
      toast.success("Pomyślnie utworzono pulę", {
        position: 'bottom-right',
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
  };

  function handleSubmit(event) {
    event.preventDefault();

    if (nazwa.length > 20) {
      toast.error("Nazwa nie może zawierać więcej niż 20 znaków", {
        position: 'bottom-right',
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

    if (nazwa.length === 0) {
      toast.error("Nie podano nazwy", {
        position: 'bottom-right',
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

    fetch(`http://localhost:8080/pula/zmien_nazwe/?pulaID=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nazwa: nazwa,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.message, {
            position: 'bottom-right',
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
          const fetchData = async () => {
            const response = await fetch('http://localhost:8080/pula/wyswietl_pule', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const data = await response.json();
            setPulePytan(data);
          };
          fetchData();
          toast.success(data.message, {
            position: 'bottom-right',
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
    setPopup(false);
  }

  const pulasForCurrentPage = pulePytan.slice(currentPage * 8, (currentPage + 1) * 8);

  const handlePageChange = (page) => {
    setCurrentPage(page.selected);
  };

  if (pulePytan.length === 0){
    return(
      <>
        <NavbarN />
        <div className="back">
          <div className="container2">
            <label className="custom-label2">
              Nie posiadasz jeszcze żadnych pul pytań...
            </label>
            <button type="button" className="custom-button5" onClick={() => handleClickStworz()}>Stwórz nową pulę</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="main-background">
      <Popup trigger={popup} setTrigger={setPopup}>
        <form className="custom-form" onSubmit={handleSubmit}>
          <label className="custom-label">
            Wprowadź nową nazwę
            <input
              className="custom-input"
              type="text"
              value={nazwa}
              onChange={(event) => setNazwa(event.target.value)}
            />
          </label>
          <br />
          <button className="custom-button" type="submit">Zapisz</button>
        </form>
      </Popup>
      <Popup trigger={popup2} setTrigger={setPopup2}>
        <div className="popup-inside">
          <label className="custom-label">
            Czy na pewno chcesz usunąć pulę?
          </label>
          <br />
          <button className="custom-button3" type="button" onClick={() => handleDelete()}>Usuń</button>
        </div>
      </Popup>
      <NavbarN />
      <ToastContainer />
      <Container className="pule-container">
        <Container className="card-container">
          <button type="button" className="custom-button4" onClick={() => handleClickStworz()}>Stwórz nową pulę</button>
          <Row >
            {pulasForCurrentPage.map((pula) => (
              <Col key={pula.pulaID} xs={3} style={{marginBottom: "20px"}}>
                <Card className="card-custom">
                  <Card.Body className="card-body">
                    <Card.Title>{pula.nazwa}
                    <button type="button" className="custom-button6" onClick={() => {setPopup(true); setId(pula.pulaID); setNazwa("")}}><HiOutlinePencilAlt /></button>
                    </Card.Title>
                    <Card.Text>Liczba pytań: {pula.iloscPytan}</Card.Text>
                    <button type="button" className="custom-button2" onClick={() => window.location.href = `/wyswietl-pytania/?pulaID=${pula.pulaID}`}>Zarządzaj pytaniami</button>
                    <button type="button" className="custom-button2" onClick={() => window.location.href = '/zaplanuj-test'}>Zaplanuj test</button>
                    <button type="button" className="custom-button3" onClick={() => {setPopup2(true); setId(pula.pulaID)}}>Usuń pule</button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={numPages}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            renderOnZeroPageCount={null}
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
          />
        </Container>
      </Container>
    </div>
  );
}

export default NauczycielPule;