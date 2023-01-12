import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarN from './NavbarN';
import './nauczycielpule.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import Popup from '../Popup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { VscClose } from 'react-icons/vsc';

function NauczycielPule() {
  const [pulePytan, setPulePytan] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(pulePytan.length / 8);
  const [nazwa, setNazwa] = useState('');
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);
  const [pulaID, setPulaID] = useState('');
  const token = localStorage.getItem('token');
  const [nazwaTest, setNazwaTest] = useState('');
  const [czasTest, setCzasTest] = useState('');
  const [iloscPytanTest, setIloscPytanTest] = useState('');
  const [dataTest, setDataTest] = useState(null);
  const [iloscPytanWPuli, setIloscPytanWPuli] = useState('');

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

  useEffect(() => {
    fetchPulePytan();
  },[fetchPulePytan]);

  const handleDelete = async () => {
    axios.delete(`http://localhost:8080/pula/usun_pule/?pulaID=${pulaID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 200 ) {
        showSucces(response.data.message);
      }
      fetchPulePytan();
    })
    .catch(error => {
      showError(error.response.data.message);
    });
    setPopup2(false);
  };

  const handleClickStworz = async () => {
    axios.post(`http://localhost:8080/pula/stworz_pule`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 200 ) {
        showSucces(response.data.message);
      }
      fetchPulePytan();
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  };

  function handleSubmit(event) {
    event.preventDefault();

    if (nazwa.length > 20) {
      showError("Nazwa nie może zawierać więcej niż 20 znaków");
      return;
    }

    if (nazwa.length === 0) {
      showError("Nie podano nazwy");
      return;
    }

    axios.put(`http://localhost:8080/pula/zmien_nazwe/?pulaID=${pulaID}`, { nazwa: nazwa }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 200 ) {
        showSucces(response.data.message);
      }
      fetchPulePytan();
    })
    .catch(error => {
      showError(error.response.data.message);
    });
    setPopup(false);
  }

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
        showSucces(response.data.message);
        showInfo(`Kod dostępu: ${response.data.kodDostepu} skopiowano do schowka`);
        navigator.clipboard.writeText(response.data.kodDostepu);
        setPopup3(false);
        setNazwaTest('');
        setDataTest(null);
        setCzasTest('');
        setIloscPytanTest('');
      }
    })
    .catch(error => {
      showError(error.response.data.message);
    });
  }


  const pulasForCurrentPage = pulePytan.slice(currentPage * 8, (currentPage + 1) * 8);

  const handlePageChange = (page) => {
    setCurrentPage(page.selected);
  };

  function resetForm(){
    setNazwaTest('');
    setDataTest(null);
    setCzasTest('');
    setIloscPytanTest('');
    setNazwa('');
  }

  if (pulePytan.length === 0){
    return(
      <>
        <NavbarN />
        <ToastContainer />
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
      <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup(false); resetForm()}}><VscClose size={25}/></button>
        <form className="custom-form" onSubmit={handleSubmit}>
          <label className="custom-label">
            Wprowadź nową nazwę <label style={{fontWeight:"500", color:"#2a71ce"}} className={nazwa.length > 20 ? "red-label" : ""}>[{nazwa.length}/20]</label>
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
          <label className="custom-label" style={{fontWeight:"500"}}>
            Czy na pewno chcesz usunąć pulę?
          </label>
          <br />
          <button className="custom-button3" type="button" onClick={() => handleDelete()}>Usuń</button>
        </div>
      </Popup>
      <Popup trigger={popup3} setTrigger={setPopup3}>
      <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup3(false); resetForm()}}><VscClose size={25}/></button>
        <form className="custom-form" onSubmit={handleSubmit2}>
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
          <button type="button" className="custom-button4" onClick={() => handleClickStworz()}>Stwórz nową pulę</button>
          <Row >
            {pulasForCurrentPage.map((pula) => (
              <Col key={pula.pulaID} xs={3} style={{marginBottom: "20px"}}>
                <Card className="card-custom">
                  <Card.Body className="card-body">
                    <Card.Title>{pula.nazwa}
                    <button type="button" className="custom-button6" onClick={() => {setPopup(true); setPulaID(pula.pulaID)}}><HiOutlinePencilAlt /></button>
                    </Card.Title>
                    <Card.Text>Ilość pytań: {pula.iloscPytan}</Card.Text>
                    <button type="button" className="custom-button2" onClick={() => window.location.href = `/wyswietl-pytania/?pulaID=${pula.pulaID}`}>Zarządzaj pytaniami</button>
                    <button type="button" className="custom-button2" onClick={() => {if(pula.iloscPytan >= 5){setPopup3(true); setPulaID(pula.pulaID); setIloscPytanWPuli(pula.iloscPytan)}else{showError("W puli musi być przynajmniej 5 pytań aby zaplanować test")}}}>Zaplanuj test</button>
                    <button type="button" className="custom-button3" onClick={() => {setPopup2(true); setPulaID(pula.pulaID)}}>Usuń pule</button>
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