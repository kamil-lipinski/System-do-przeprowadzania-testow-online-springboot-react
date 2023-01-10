import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycieltesty.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Popup from '../Popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TestyButton from './TestyButton';

function NauczycielTesty() {
  const [testy, setTesty] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(testy.length / 8);
  const token = localStorage.getItem('token');
  const [currentTime, setCurrentTime] = useState(new Date());

  const showError = message => {
    toast.error(message, {
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
  };

  const showSucces = message => {
    toast.success(message, {
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
  };

  const showInfo = message => {
    toast.info(message, { 
      position: 'bottom-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'colored',
      transition: Flip,
    });
  };

  const fetchTesty = useCallback(async () => {
    axios.get('http://localhost:8080/test/wyswietl_testy_zaplanowane', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setTesty(response.data);
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  }, [token]);

  useEffect(() => {
    fetchTesty();
  },[fetchTesty]);

  const sortedTests = testy.sort((a, b) => {
    let [dmyA, timeA] = a.data.split(" ");
    let [dayA, monthA, yearA] = dmyA.split("/");
    let [hourA, minuteA, secondA] = timeA.split(":");
    const dataA = new Date(yearA, monthA - 1, dayA, hourA, minuteA, secondA);
    
    let [dmyB, timeB] = b.data.split(" ");
    let [dayB, monthB, yearB] = dmyB.split("/");
    let [hourB, minuteB, secondB] = timeB.split(":");
    const dataB = new Date(yearB, monthB - 1, dayB, hourB, minuteB, secondB);

    return dataA - dataB;
  });
  
  const testsForCurrentPage = sortedTests.slice(currentPage * 8, (currentPage + 1) * 8);

  const handlePageChange = (page) => {
    setCurrentPage(page.selected);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function countdown(DateString) {
    let now = currentTime;
    let [dmy, time] = DateString.split(" ");
    let [day, month, year] = dmy.split("/");
    let [hour, minute, second] = time.split(":");
    const dataTestu = new Date(year, month - 1, day, hour, minute, second);

    if (now > dataTestu) {
      fetchTesty();
      return 'TEST TRWA';
    }

    let remaining = dataTestu - now;

    let days = Math.floor(remaining / (1000 * 60 * 60 * 24));

    let hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let hours2 = hours.toString();
    if (hours2.length === 1){
      hours2 = "0" + hours;
    };

    let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    let minutes2 = minutes.toString();
    if (minutes2.length === 1){
      minutes2 = "0" + minutes;
    };

    let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    let seconds2 = seconds.toString();
    if (seconds2.length === 1){
      seconds2 = "0" + seconds;
    };

    return(`${days}d ${hours2}:${minutes2}:${seconds2}`);
  }

  return (
    <div className="main-background">
      <NavbarN />
      <ToastContainer />
      <Container className="pule-container">
        <Container className="card-container">
          <div className="buttons-container">
            <TestyButton/><button type="button" className="custom-button4">Zaplanuj test</button>
          </div>
          <Row >
            {testsForCurrentPage.map((test) => (
              <Col key={test.testID} xs={3} style={{marginBottom: "20px"}}>
                <Card className="card-custom">
                  <Card.Body className="card-body">
                    <Card.Title >{test.nazwa}</Card.Title>
                    <hr style={{marginTop:"0px", marginBottom:"20px", borderRadius:"3px"}}/>
                    <Card.Text><span style={{fontWeight:"500"}}>Do rozpoczęcia: </span>{countdown(test.data)}</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Data testu: </span>{test.data.slice(0, -3)}</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Czas: </span>{test.czas} min <span style={{fontWeight:"500"}}>Ilość pytań: </span>{test.iloscPytan}</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Kod dostępu: </span><span style={{fontWeight:"bold", color:"#2a71ce"}}>{test.kodDostepu}</span></Card.Text>
                    <button type="button" className="custom-button3">Odwołaj test</button>
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

export default NauczycielTesty;