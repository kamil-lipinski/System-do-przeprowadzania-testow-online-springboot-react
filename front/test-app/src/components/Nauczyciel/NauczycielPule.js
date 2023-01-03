import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycielpule.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';

function NauczycielPule() {
  const [pulePytan, setPulePytan] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(pulePytan.length / 8);

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

  const handleDelete = async (pulaID) => {
    const response2 = await fetch(`http://localhost:8080/pula/usun_pule/?pulaID=${pulaID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response2.status === 403 ) {
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
  };

  const pulasForCurrentPage = pulePytan.slice(currentPage * 8, (currentPage + 1) * 8);

  const handlePageChange = (page) => {
    setCurrentPage(page.selected);
  };

  if (pulePytan.length === 0){
    return(
      <>
        <NavbarN />
        <div className="container">
          <button type="button" className="custom-button5">Stwórz nową pulę</button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarN />
      <ToastContainer />
      <Container className="pule-container">
        <Container className="card-container">
          <button type="button" className="custom-button4">Stwórz nową pulę</button>
          <Row >
            {pulasForCurrentPage.map((pula) => (
              <Col key={pula.pulaID} xs={3} style={{marginBottom: "20px"}}>
                <Card className="card-custom">
                  <Card.Body className="card-body">
                    <Card.Title>{pula.nazwa}</Card.Title>
                    <Card.Text>Liczba pytań: {pula.iloscPytan}</Card.Text>
                    <button type="button" className="custom-button2">Podgląd</button>
                    <button type="button" className="custom-button2">Zaplanuj test</button>
                    <button type="button" className="custom-button3" onClick={() => handleDelete(pula.pulaID)}>Usuń pule</button>
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
    </>
  );
}

export default NauczycielPule;