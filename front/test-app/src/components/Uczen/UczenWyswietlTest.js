import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarU from './NavbarU';
import '../Nauczyciel/nauczycieltesty.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import Popup from '../Popup';
import axios from 'axios';
import './uczentesty.css';
import './uczenwyswietltest.css';

function UczenWyswietlTest() {
    const currentUrl = window.location.search;
    const testID = new URLSearchParams(currentUrl).get('testID');
    const [pytania, setPytania] = useState([]);
    const [odp, setOdp] = useState([]);
    const [popup, setPopup] = useState(false);
    const [popup2, setPopup2] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const numPages = Math.ceil(pytania.length / 72);
    const token = sessionStorage.getItem('token');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [test, setTest] = useState({});
    const [a, setA] = useState(false);
    const [b, setB] = useState(false);
    const [c, setC] = useState(false);
    const [d, setD] = useState(false);
    const [e, setE] = useState(false);
    const [f, setF] = useState(false);
    const [info, setInfo] = useState(false);
    const [tresc, setTresc] = useState('');
    const [atresc, setATresc] = useState('');
    const [btresc, setBTresc] = useState('');
    const [ctresc, setCTresc] = useState('');
    const [dtresc, setDTresc] = useState('');
    const [etresc, setETresc] = useState('');
    const [ftresc, setFTresc] = useState('');
    const [nr, setNr] = useState('');
    const [pytanieID, setPytanieID] = useState('');
    const [wynik, setWynik] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
            toastId: "toastAvoidsDuplicates"
        });
    };

    const fetchWynik = useCallback(async () => {
        axios.get(`http://localhost:8080/wynik/wyswietl_wynik_u/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setWynik(response.data);
        })
        .catch(error => {
            showError(error);
        });
    }, [token, testID]);

    const fetchPytania = useCallback(async () => {
        axios.get(`http://localhost:8080/test/wyswietl_pytania_do_testu/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setPytania(response.data);
        })
        .catch(error => {
            showError(error.response.data.message);
        });
    }, [token, testID]);

    const fetchTest = useCallback(async () => {
        axios.get(`http://localhost:8080/test/wyswietl_test/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setTest(response.data);
        })
        .catch(error => {
            showError(error.response.data.message);
        });
    }, [token, testID]);

    const fetchOdp = useCallback(async () => {
        axios.get(`http://localhost:8080/odpowiedz/wyswietl_odp/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setOdp(response.data);
        })
        .catch(error => {
            showError(error.response.data.message);
        });
    }, [token, testID]);

    useEffect(() => {
        fetchPytania();
        fetchTest();
        fetchOdp();
        fetchWynik();
    }, [fetchPytania, fetchTest, fetchOdp, fetchWynik]);

    const pytaniaNrPytania = pytania.map((pytanie, index) => {
        return {...pytanie, nrPytania: index+1};
    });

    const pytaniaForCurrentPage = pytaniaNrPytania.slice(currentPage * 72, (currentPage + 1) * 72);

    const handlePageChange = (page) => {
        setCurrentPage(page.selected);
    };

    function countdown(DateString, czas) {
        if(DateString === null || DateString === undefined){
            return '';
        }

        let now = currentTime;
        let [dmy, time] = DateString.split(" ");
        let [day, month, year] = dmy.split("/");
        let [hour, minute, second] = time.split(":");
        const dataTestu = new Date(year, month - 1, day, hour, minute, second);
        const dataZakonczeniaTestu = dataTestu.setMinutes(dataTestu.getMinutes() + czas);

        if (now > dataZakonczeniaTestu) {
            fetchWynik();
            return 'TEST ZAKOŃCZONY';
        }
    
        let remaining = dataZakonczeniaTestu - now;
    
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

        if (hours === 0 && minutes === 5 && seconds === 0 && !info){
            setInfo(true);
            showInfo("Do zakończenia testu pozostało 5 minut");
        }
        
        return(`${hours2}:${minutes2}:${seconds2}`);
    }

    let i = 0;
    odp.forEach(function(o){
        if (o.a === true || o.b === true || o.c === true || o.d === true || o.e === true || o.f === true){
            i++;
        }
    });

    function handleSubmit(event) {
        event.preventDefault();

        const data = {
            a: a,
            b: b,
            c: c,
            d: d,
            e: e,
            f: f,
        };

        axios.put(`http://localhost:8080/odpowiedz/odpowiedz_na_pytanie/?pytanieID=${pytanieID}&testID=${testID}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200 ) {
            showSucces(response.data.message);
            setPopup(false);
            fetchOdp();
          }
        })
        .catch(error => {
          showError(error.response.data.message);
        });
    }

    function zakonczTest() {
        axios.put(`http://localhost:8080/test/zakoncz_test/?testID=${testID}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200 ) {
            showSucces(response.data.message);
            fetchWynik();
          }
        })
        .catch(error => {
          showError(error.response.data.message);
        });
        setPopup2(false);
    }

    if(test.status === "zaplanowany"){
        return(
            <div className="main-background">
                <NavbarU />
                <ToastContainer />
                <div className="back">
                    <div className="container2">
                        <label className="custom-label2">
                            Test jeszcze się nie rozpoczął...
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    if(test.status === "zakonczony" || wynik.wynik !== -1){
        return(
            <div className="main-background">
                <NavbarU />
                <ToastContainer />
                <div className="back">
                    <div className="container2">
                        <label className="custom-label2">
                            Zakończono test...
                            <br/>
                            Twój wynik: <span style={{ fontWeight: "bold", color: "#2a71ce" }}>{wynik.wynik}/{test.iloscPytan}</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="main-background">
            <Popup trigger={popup} setTrigger={setPopup}>
                <form className="custom-form3" onSubmit={handleSubmit}>
                    <Card className="card-custom3">
                        <Card.Body className="card-body3">  
                            <Card.Title className="custom-cardtitle" style={{fontWeight:"600"}}>
                            {nr}. {tresc}
                                <hr style={{borderRadius:"3px"}}/>
                            </Card.Title>
                            <Card.Text className={
                                atresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={a}
                                            onChange={(event) => setA(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    A: {atresc}
                            </Card.Text>
                            <Card.Text className={
                                btresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={b}
                                            onChange={(event) => setB(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    B: {btresc}
                            </Card.Text>
                            <Card.Text className={
                                ctresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={c}
                                            onChange={(event) => setC(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    C: {ctresc}
                            </Card.Text>
                            <Card.Text className={
                                dtresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={d}
                                            onChange={(event) => setD(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    D: {dtresc}
                            </Card.Text>
                            <Card.Text className={
                                etresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={e}
                                            onChange={(event) => setE(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    E: {etresc}
                            </Card.Text>
                            <Card.Text className={
                                ftresc === null ? 'custom-cardtext-null' : 'custom-cardtext2'}>
                                    <label class="checkbox-container2" style={{left:"-150px", top:"3px"}}>
                                        <input
                                            className="custom-input"
                                            type="checkbox"
                                            checked={f}
                                            onChange={(event) => setF(event.target.checked)}
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                    F: {ftresc}
                            </Card.Text>
                            <button className="custom-button14" type="submit">Zapisz odpowiedź</button>
                        </Card.Body>
                    </Card>
                </form>
            </Popup>
            <Popup trigger={popup2} setTrigger={setPopup2}>
                <div className="popup-inside">
                    <label className="custom-label" style={{fontWeight:"500"}}>
                        Czy na pewno chcesz zakończyć test?
                    </label>
                    <br />
                    <button className="custom-button2" type="button" onClick={() => zakonczTest()}>Zakończ</button>
                </div>
            </Popup>
            <NavbarU />
            <ToastContainer />
            <Container className="pule-container">
                <Container className="card-container">
                    <button type="button" className="custom-button4" onClick={() => setPopup2(true)}>Zakończ test</button>
                    <label className="custom-label4" style={{top:'23px'}}>
                        <span style={{ fontWeight: "500" }}>Test: </span><span style={{ fontWeight:"normal" }}>{test.nazwa}</span>
                    </label>
                    <label className="custom-label4" style={{top:'50px'}}>
                        <span style={{ fontWeight: "500" }}>Do zakończenia: </span><span style={{ fontWeight: "bold", color: "#2a71ce" }}>{countdown(test.data, test.czas)}</span>
                    </label>
                    <label className="custom-label4" style={{top:'77px'}}>
                        <span style={{ fontWeight: "500" }}>Udzielonych odpowiedzi: </span><span style={{ fontWeight:"normal" }}>{i}/{test.iloscPytan}</span>
                    </label>
                    <Row >
                        {pytaniaForCurrentPage.map((pytanie) => (
                            <Col key={pytanie.pytanieID} xs={1} style={{ marginBottom: "20px" }}>
                                <button type="button" className={odp[pytanie.nrPytania-1]?.a || 0 === true || 
                                                                odp[pytanie.nrPytania-1]?.b || 0 === true ||
                                                                odp[pytanie.nrPytania-1]?.c || 0 === true ||
                                                                odp[pytanie.nrPytania-1]?.d || 0 === true ||
                                                                odp[pytanie.nrPytania-1]?.e || 0 === true ||
                                                                odp[pytanie.nrPytania-1]?.f || 0 === true ? "custom-button13" : "custom-button12"} 
                                onClick={() => {
                                    setPopup(true); setNr(pytanie.nrPytania); setTresc(pytanie.tresc); setATresc(pytanie.a); 
                                    setBTresc(pytanie.b); setCTresc(pytanie.c); setDTresc(pytanie.d); 
                                    setETresc(pytanie.e); setFTresc(pytanie.f); setPytanieID(pytanie.pytanieID);
                                    setA(odp[pytanie.nrPytania-1].a); setB(odp[pytanie.nrPytania-1].b);
                                    setC(odp[pytanie.nrPytania-1].c); setD(odp[pytanie.nrPytania-1].d);
                                    setE(odp[pytanie.nrPytania-1].e); setF(odp[pytanie.nrPytania-1].f);
                                }}>Pytanie<br/>{pytanie.nrPytania}</button>
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

export default UczenWyswietlTest
