import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycielpule.css';

function NauczycielPule() {
  const [pulePytan, setPulePytan] = useState([]);

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

  return (
    <>
      <NavbarN />
      <Container className="card-container">
        <Row >
          {pulePytan.map((pula) => (
            <Col key={pula.pulaID} xs={3} style={{marginBottom: "20px"}}>
              <Card className="card-custom">
                <Card.Body className="card-body">
                  <Card.Title>{pula.nazwa}</Card.Title>
                  <Card.Text>Liczba pytań: {pula.iloscPytan}</Card.Text>
                  <button type="button" className="custom-button2">Podgląd</button>
                  <button type="button" className="custom-button2">Zaplanuj test</button>
                  <button type="button" className="custom-button3">Usuń pule</button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default NauczycielPule;