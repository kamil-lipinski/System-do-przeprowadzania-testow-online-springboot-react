import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycieltesty.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import Popup from '../Popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TestyButton from './TestyButtonN';
import Select from "react-dropdown-select";
import { VscClose } from 'react-icons/vsc';

function NauczycielTestyZakonczone() {
  const [testy, setTesty] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(testy.length / 8);
  const token = localStorage.getItem('token');
  const [popup3, setPopup3] = useState(false);
  const [nazwaTest, setNazwaTest] = useState('');
  const [czasTest, setCzasTest] = useState('');
  const [iloscPytanTest, setIloscPytanTest] = useState('');
  const [dataTest, setDataTest] = useState(null);
  const [iloscPytanWPuli, setIloscPytanWPuli] = useState('');
  const [pulaID, setPulaID] = useState(null);
  const [pulePytan, setPulePytan] = useState([]);

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
    axios.get('http://localhost:8080/test/wyswietl_testy_zakonczone_n', {
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

  const fetchPulePytan = useCallback(async () => {
    axios.get('http://localhost:8080/pula/wyswietl_pule', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setPulePytan(response.data);
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  }, [token]);

  function handleSubmit2(event) {
    event.preventDefault();

    if (nazwaTest.length > 20) {
      showError("Nazwa nie może zawierać więcej niż 20 znaków");
      return;
    }

    if (nazwaTest.length === 0 || dataTest === null) {
      showError("Nie wypełniono wszystkich pól");
      return;
    }

    function formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      let hour = '' + d.getHours();
      let minute = '' + d.getMinutes();
      let second = '' + d.getSeconds();
    
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hour.length < 2) hour = '0' + hour;
      if (minute.length < 2) minute = '0' + minute;
      if (second.length < 2) second = '0' + second;
    
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }

    axios.post("http://localhost:8080/test/zaplanuj_test", { pulaID : pulaID,
                                                      nazwa : nazwaTest,
                                                      data : formatDate(dataTest),
                                                      czas : czasTest,
                                                      iloscPytan: iloscPytanTest 
                                                    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 200 ) {
        fetchTesty();
        showSucces(response.data.message);
        showInfo(`Kod dostępu: ${response.data.kodDostepu}`);
        setPopup3(false);
        setNazwaTest('');
        setDataTest(null);
        setCzasTest('');
        setIloscPytanTest('');
        setPulaID(null);
      }
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  }

  function resetForm(){
    setNazwaTest('');
    setDataTest(null);
    setCzasTest('');
    setIloscPytanTest('');
    setPulaID(null);
    setIloscPytanWPuli('');
  }

  if (testy.length === 0){
    return(
      <div className="main-background">
        <Popup trigger={popup3} setTrigger={setPopup3}>
          <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup3(false); resetForm()}}><VscClose size={25}/></button>
          <form className="custom-form" onSubmit={handleSubmit2}>
            <label className="custom-label">
              Pula
              <Select
                options={pulePytan}
                labelField="nazwa"
                valueField="pulaID"
                onChange={(values) => {setPulaID(values[0].pulaID);setIloscPytanWPuli(values[0].iloscPytan)}}
                placeholder="Wybierz pulę"
                className="custom-select"
              />
            </label>
            <br />
            <label className="custom-label">
              Nazwa testu <label style={{fontWeight:"500", color:"#2a71ce"}} className={nazwaTest.length > 20 ? "red-label" : ""}>[{nazwaTest.length}/20]</label>
              <input
                className="custom-input"
                type="text"
                value={nazwaTest}
                onChange={(event) => setNazwaTest(event.target.value)}
              />
            </label>
            <br />
            <label className="custom-label">
              Data
              <DatePicker
                selected={dataTest}
                onChange={(date) => setDataTest(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                timeCaption="Godzina"
                className="custom-date-picker"
              />
            </label>
            <br />
            <label className="custom-label">
              Czas <label style={{fontWeight:"500", color:"#2a71ce"}}>[min]</label>
              <input
                className="custom-input"
                type="number"
                value={czasTest}
                onChange={(event) => setCzasTest(event.target.value)}
                min={1}
                max={180}
              />
            </label>
            <br />
            <label className="custom-label">
              Ilość Pytań <label style={{fontWeight:"500", color:"#2a71ce"}}>[{iloscPytanWPuli} pytań w puli]</label>
              <input
                className="custom-input"
                type="number"
                value={iloscPytanTest}
                onChange={(event) => setIloscPytanTest(event.target.value)}
                min={1}
                max={iloscPytanWPuli}
              />
            </label>
            <br />
            <button className="custom-button" type="submit">Zaplanuj</button>
          </form>
        </Popup>
        <NavbarN />
        <ToastContainer />
        <div className="back">
          <div className="container2">
          <TestyButton />
            <label className="custom-label2">
              Nie posiadasz żadnych zakończonych testów...
            </label>
            <button type="button" className="custom-button5" onClick={() => {setPopup3(true); fetchPulePytan()}}>Zaplanuj test</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-background">
      <Popup trigger={popup3} setTrigger={setPopup3}>
        <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup3(false); resetForm()}}><VscClose size={25}/></button>
        <form className="custom-form" onSubmit={handleSubmit2}>
          <label className="custom-label">
            Pula
            <Select
              options={pulePytan}
              labelField="nazwa"
              valueField="pulaID"
              onChange={(values) => {setPulaID(values[0].pulaID);setIloscPytanWPuli(values[0].iloscPytan)}}
              placeholder="Wybierz pulę"
              className="custom-select"
            />
          </label>
          <br />
          <label className="custom-label">
            Nazwa testu <label style={{fontWeight:"500", color:"#2a71ce"}} className={nazwaTest.length > 20 ? "red-label" : ""}>[{nazwaTest.length}/20]</label>
            <input
              className="custom-input"
              type="text"
              value={nazwaTest}
              onChange={(event) => setNazwaTest(event.target.value)}
            />
          </label>
          <br />
          <label className="custom-label">
            Data
            <DatePicker
              selected={dataTest}
              onChange={(date) => setDataTest(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              timeCaption="Godzina"
              className="custom-date-picker"
            />
          </label>
          <br />
          <label className="custom-label">
            Czas <label style={{fontWeight:"500", color:"#2a71ce"}}>[min]</label>
            <input
              className="custom-input"
              type="number"
              value={czasTest}
              onChange={(event) => setCzasTest(event.target.value)}
              min={1}
              max={180}
            />
          </label>
          <br />
          <label className="custom-label">
            Ilość Pytań <label style={{fontWeight:"500", color:"#2a71ce"}}>[{iloscPytanWPuli} pytań w puli]</label>
            <input
              className="custom-input"
              type="number"
              value={iloscPytanTest}
              onChange={(event) => setIloscPytanTest(event.target.value)}
              min={1}
              max={iloscPytanWPuli}
            />
          </label>
          <br />
          <button className="custom-button" type="submit">Zaplanuj</button>
        </form>
      </Popup>
      <NavbarN />
      <ToastContainer />
      <Container className="pule-container">
        <Container className="card-container">
          <div className="buttons-container">
            <TestyButton/><button type="button" className="custom-button4" onClick={() => {setPopup3(true); fetchPulePytan()}}>Zaplanuj test</button>
          </div>
          <Row >
            {testsForCurrentPage.map((test) => (
              <Col key={test.testID} xs={3} style={{marginBottom: "20px"}}>
                <Card className="card-custom">
                  <Card.Body className="card-body">
                    <Card.Title >{test.nazwa}</Card.Title>
                    <hr style={{marginTop:"0px", marginBottom:"20px", borderRadius:"3px"}}/>
                    <Card.Text><span style={{fontWeight:"500"}}>Data rozpoczęcia: </span>{test.data.slice(0, -3)}</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Czas: </span>{test.czas} min</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Ilość pytań: </span>{test.iloscPytan}</Card.Text>
                    <Card.Text><span style={{fontWeight:"500"}}>Zapisanych: </span>{test.iloscZapisanych}</Card.Text>
                    <button type="button" className="custom-button2">Zobacz wyniki</button>
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

export default NauczycielTestyZakonczone;