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
import TestyButton from './TestyButtonU';
import { VscClose } from 'react-icons/vsc';
import './uczentesty.css';

function UczenTestyZakonczone() {
    const [testy, setTesty] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const numPages = Math.ceil(testy.length / 8);
    const token = sessionStorage.getItem('token');
    const [popup, setPopup] = useState(false);
    const [kodDostepu, setKodDostepu] = useState('');
    const [wynik, setWynik] = useState({});
    const [fetchedWynik, setFetchedWynik] = useState(false);

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

    const fetchTesty = useCallback(async () => {
        axios.get('http://localhost:8080/test/wyswietl_testy_zakonczone_u', {
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
    }, [fetchTesty]);

    const fetchWynik = useCallback(async (testID) => {
        const response = await axios.get(`http://localhost:8080/wynik/wyswietl_wynik_u/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setWynik(prevWynik => {
            return {...prevWynik, [testID]: response.data.wynik}
        });
    }, [token]);

    useEffect(() => {
        if (testy.length > 0 && !fetchedWynik) {
          testy.forEach((test) => fetchWynik(test.testID));
          setFetchedWynik(true);
        }
    }, [testy, fetchWynik, fetchedWynik]);

    const sortedTests = testy.sort((a, b) => {
        let [dmyA, timeA] = a.data.split(" ");
        let [dayA, monthA, yearA] = dmyA.split("/");
        let [hourA, minuteA, secondA] = timeA.split(":");
        const dataA = new Date(yearA, monthA - 1, dayA, hourA, minuteA, secondA);

        let [dmyB, timeB] = b.data.split(" ");
        let [dayB, monthB, yearB] = dmyB.split("/");
        let [hourB, minuteB, secondB] = timeB.split(":");
        const dataB = new Date(yearB, monthB - 1, dayB, hourB, minuteB, secondB);

        return dataB - dataA;
    });

    const testsForCurrentPage = sortedTests.slice(currentPage * 8, (currentPage + 1) * 8);
    

    const handlePageChange = (page) => {
        setCurrentPage(page.selected);
    };

    function handleSubmit(event) {
        event.preventDefault();

        axios.post("http://localhost:8080/test/zapisz_sie_na_test", {kodDostepu : kodDostepu}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.status === 200) {
                fetchTesty();
                showSucces(response.data.message);
                setPopup(false);
                setKodDostepu('');
            }
        })
        .catch(error => {
            showError(error.response.data.message);
        });
    }
    
    if (testy.length === 0) {
        return (
            <div className="main-background">
                <Popup trigger={popup} setTrigger={setPopup}>
                    <button className="custom-button7" style={{ zIndex: "10" }} onClick={() => { setPopup(false); setKodDostepu('') }}><VscClose size={25} /></button>
                    <form className="custom-form" onSubmit={handleSubmit}>
                        <label className="custom-label">
                            Wprowadź kod dostępu
                            <input
                                className="custom-input"
                                type="text"
                                value={kodDostepu}
                                onChange={(event) => setKodDostepu(event.target.value)}
                                maxLength={5}
                            />
                        </label>
                        <br />
                        <button className="custom-button" type="submit">Zapisz się na test</button>
                    </form>
                </Popup>
                <NavbarU />
                <ToastContainer />
                <div className="back">
                    <div className="container2">
                        <TestyButton />
                        <label className="custom-label2">
                            Nie posiadasz żadnych zakończonych testów...
                        </label>
                        <button type="button" className="custom-button5" onClick={() => setPopup(true)}>Zapisz się na test</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-background">
            <Popup trigger={popup} setTrigger={setPopup}>
                <button className="custom-button7" style={{ zIndex: "10" }} onClick={() => { setPopup(false); setKodDostepu('') }}><VscClose size={25} /></button>
                <form className="custom-form" onSubmit={handleSubmit}>
                    <label className="custom-label">
                        Wprowadź kod dostępu
                        <input
                            className="custom-input"
                            type="text"
                            value={kodDostepu}
                            onChange={(event) => setKodDostepu(event.target.value)}
                            maxLength={5}
                        />
                    </label>
                    <br />
                    <button className="custom-button" type="submit">Zapisz się na test</button>
                </form>
            </Popup>
            <NavbarU />
            <ToastContainer />
            <Container className="pule-container">
                <Container className="card-container">
                    <div className="buttons-container2">
                        <TestyButton /><button type="button" className="custom-button4" onClick={() => setPopup(true)}>Zapisz się na test</button>
                    </div>
                    <Row >
                        {testsForCurrentPage.map((test) => (
                            <Col key={test.testID} xs={3} style={{ marginBottom: "20px" }}>
                                <Card className="card-custom">
                                    <Card.Body className="card-body">
                                        <Card.Title>{test.nazwa}</Card.Title>
                                        <hr style={{ marginTop: "0px", marginBottom: "20px", borderRadius: "3px" }} />
                                        <Card.Text><span style={{ fontWeight: "500" }}>Data rozpoczęcia: </span><br/>{test.data.slice(0, -3)}</Card.Text>
                                        <Card.Text><span style={{ fontWeight: "500" }}>Czas: </span>{test.czas} min</Card.Text>
                                        <Card.Text><span style={{ fontWeight: "500" }}>Ilość pytań: </span>{test.iloscPytan}</Card.Text>
                                        <Card.Text><span style={{ fontWeight: "500" }}>Twój wynik: </span><span style={{ fontWeight: "bold", color: "#2a71ce" }}>{wynik[test.testID]}/{test.iloscPytan}</span></Card.Text>
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

export default UczenTestyZakonczone;