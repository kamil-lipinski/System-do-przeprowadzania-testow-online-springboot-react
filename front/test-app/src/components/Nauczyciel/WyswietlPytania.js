import React, { useState, useEffect } from 'react';
import NavbarN from './NavbarN';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import { TiTickOutline } from 'react-icons/ti';
import './wyswietlpytania.css'
import Popup from './Popup';

function WyswietlPytania() {
    const currentUrl = window.location.search;
    const pulaID = new URLSearchParams(currentUrl).get('pulaID');
    const [nazwa, setNazwa] = useState('');
    const [ilosc, setIlosc] = useState('');
    const [pytania, setPytania] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const numPages = Math.ceil(pytania.length / 4);
    const [popup2, setPopup2] = useState(false);
    const [pytanieID, setPytanieID] = useState('');

    useEffect(() => {
        const fetchNazwa = async () => {
            const response = await fetch(`http://localhost:8080/pula/info/?pulaID=${pulaID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data2 = await response.json();
            setNazwa(data2.nazwa);
            setIlosc(data2.iloscPytan);
        };
        fetchNazwa();
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/pula/wyswietl_pytania/?pulaID=${pulaID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setPytania(data);
        };
        fetchData();
    }, []);

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:8080/pytanie/usun_pytanie/?pytanieID=${pytanieID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 403 ) {
            toast.error("Nie można usunąć pytania z puli z której trwają lub są zaplanowane testy", {
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
            const fetchNazwa = async () => {
                const response = await fetch(`http://localhost:8080/pula/info/?pulaID=${pulaID}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data2 = await response.json();
                setNazwa(data2.nazwa);
                setIlosc(data2.iloscPytan);
            };
            fetchNazwa();
            const fetchData = async () => {
                const response = await fetch(`http://localhost:8080/pula/wyswietl_pytania/?pulaID=${pulaID}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setPytania(data);
            };
            fetchData();
            toast.success("Pomyślnie usunięto pytanie", {
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

    const pytaniaForCurrentPage = pytania.slice(currentPage * 4, (currentPage + 1) * 4);

    const handlePageChange = (page) => {
        setCurrentPage(page.selected);
    };

    if (pytania.length === 0){
        return(
          <>
            <NavbarN />
            <div className="back">
              <div className="container2">
                <label className="custom-label3">
                  W tej puli nie ma jeszcze żadnych pytań...
                </label>
                <button type="button" className="custom-button9">Stwórz nowe pytanie</button>
              </div>
            </div>
          </>
        );
      }

    

    return (
        <div className="main-background">
            <Popup trigger={popup2} setTrigger={setPopup2}>
                <div className="popup-inside">
                    <label className="custom-label">
                        Czy na pewno chcesz usunąć pytanie?
                    </label>
                    <br />
                    <button className="custom-button3" type="button" onClick={() => handleDelete()}>Usuń</button>
                </div>
            </Popup>
            <NavbarN />
            <ToastContainer />
            <Container className="pytania-container">
                <Container className="card-container">
                <button type="button" className="custom-button4" /*onClick={() => handleClickStworz()}*/>Stwórz nowe pytanie</button>
                <label className="custom-label2" style={{top:'50px'}}>
                    Pula: {nazwa}
                </label>
                <label className="custom-label2" style={{top:'77px'}}>
                    Ilość pytań: {ilosc}
                </label>
                <Row >
                    {pytaniaForCurrentPage.map((pytanie) => (
                        <Col key={pytanie.pytanieID} xs={3} style={{marginBottom: "20px"}}>
                            <Card className="card-custom2">
                            <Card.Body className="card-body2">
                                <Card.Title className="custom-cardtitle">{pytanie.tresc}
                                </Card.Title>
                                <Card.Text className={
                                    pytanie.a === null ? 'custom-cardtext-null' : 'custom-cardtext'}>a: {pytanie.a}
                                    <TiTickOutline size={20} className={pytanie.apoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.b === null ? 'custom-cardtext-null' : 'custom-cardtext'}>b: {pytanie.b}
                                    <TiTickOutline size={20} className={pytanie.bpoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.c === null ? 'custom-cardtext-null' : 'custom-cardtext'}>c: {pytanie.c}
                                    <TiTickOutline size={20} className={pytanie.cpoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.d === null ? 'custom-cardtext-null' : 'custom-cardtext'}>d: {pytanie.d}
                                    <TiTickOutline size={20} className={pytanie.dpoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.e === null ? 'custom-cardtext-null' : 'custom-cardtext'}>e: {pytanie.e}
                                    <TiTickOutline size={20} className={pytanie.epoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.f === null ? 'custom-cardtext-null' : 'custom-cardtext'}>f: {pytanie.f}
                                    <TiTickOutline size={20} className={pytanie.fpoprawne === false ? 'titick-false' : 'titick-true'}/>
                                </Card.Text>
                                <button type="button" className="custom-button8" onClick={() => {setPopup2(true); setPytanieID(pytanie.pytanieID)}}>Usuń pytanie</button>
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

export default WyswietlPytania
