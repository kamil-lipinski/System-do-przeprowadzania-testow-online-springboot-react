import React, { useState, useEffect, useCallback } from 'react';
import NavbarN from './NavbarN';
import { ToastContainer, toast } from 'react-toastify';
import { Flip } from 'react-toastify';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import './wyswietlpytania.css'
import Popup from '../Popup';
import axios from 'axios';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { VscClose } from 'react-icons/vsc';

function WyswietlPytania() {
    const currentUrl = window.location.search;
    const pulaID = new URLSearchParams(currentUrl).get('pulaID');
    const [nazwa, setNazwa] = useState('');
    const [ilosc, setIlosc] = useState('');
    const [pytania, setPytania] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const numPages = Math.ceil(pytania.length / 4);
    const [popup, setPopup] = useState(false);
    const [popup2, setPopup2] = useState(false);
    const [popup3, setPopup3] = useState(false);
    const [popup4, setPopup4] = useState(false);
    const [pytanieID, setPytanieID] = useState('');
    const token = sessionStorage.getItem('token');
    const [nowaNazwa, setNowaNazwa] = useState('');
    const [tresc, setTresc] = useState('');
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [d, setD] = useState('');
    const [e, setE] = useState('');
    const [f, setF] = useState('');
    const [apoprawne, setApoprawne] = useState(false);
    const [bpoprawne, setBpoprawne] = useState(false);
    const [cpoprawne, setCpoprawne] = useState(false);
    const [dpoprawne, setDpoprawne] = useState(false);
    const [epoprawne, setEpoprawne] = useState(false);
    const [fpoprawne, setFpoprawne] = useState(false);
    const [i, setI] = useState(0);

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

    const fetchInfo = useCallback(async () => {
        axios.get(`http://localhost:8080/pula/info/?pulaID=${pulaID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setNazwa(response.data.nazwa);
            setIlosc(response.data.iloscPytan);
        })
        .catch(error => {
            showError(error.response.data.message);
        });
    },[pulaID, token]);
       
    const fetchPytania = useCallback(async () => {
        axios.get(`http://localhost:8080/pula/wyswietl_pytania/?pulaID=${pulaID}`, {
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
    },[pulaID, token]);

    useEffect(() => {
        fetchInfo();
        fetchPytania();
    },[fetchInfo, fetchPytania]);

    const handleDelete = async () => {
        axios.delete(`http://localhost:8080/pytanie/usun_pytanie/?pytanieID=${pytanieID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.status === 200){
                showSucces(response.data.message);
            }
            fetchInfo();
            fetchPytania();
        })
        .catch(error => {
            showError(error.response.data.message);
        });
        setPopup2(false);
    };

    function handleSubmit(event) {
        event.preventDefault();
    
        if (nowaNazwa.length > 20) {
          showError("Nazwa nie może zawierać więcej niż 20 znaków");
          return;
        }
    
        if (nowaNazwa.length === 0) {
          showError("Nie podano nazwy");
          return;
        }
    
        axios.put(`http://localhost:8080/pula/zmien_nazwe/?pulaID=${pulaID}`, { nazwa: nowaNazwa }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200 ) {
            showSucces(response.data.message);
          }
          fetchInfo();
        })
        .catch(error => {
          showError(error.response.data.message);
        });
        setPopup(false);
    }

    function handleSubmit2(event) {
        event.preventDefault();

        const data = {
            pulaID: pulaID,
            tresc: tresc,
            a: a, aPoprawne: apoprawne,
            b: b, bPoprawne: bpoprawne,
            c: c, cPoprawne: cpoprawne,
            d: d, dPoprawne: dpoprawne,
            e: e, ePoprawne: epoprawne,
            f: f, fPoprawne: fpoprawne
        };

        if (tresc === ''){delete data.tresc;}
        if (a === ''){delete data.a;}
        if (b === ''){delete data.b;}
        if (c === ''){delete data.c;}
        if (d === ''){delete data.d;}
        if (e === ''){delete data.e;}
        if (f === ''){delete data.f;}

        if (tresc.length > 200) {
            showError("Treść nie może zawierać więcej niż 200 znaków");
            return;
        }

        let temp = 0;
        for (let i = 0; i < data.length; i++){
            if(data[i].length > 50)temp++;
        }
    
        if (temp > 0) {
            showError("Odpowiedź nie może zawierać więcej niż 50 znaków");
            return;
        }

        if(c !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
        }

        if(d !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
        }

        if(e !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
            if(d === ''){
                showError("Pytanie nie zawiera odpowiedzi D");
                return;
            }
        }

        if(f !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
            if(d === ''){
                showError("Pytanie nie zawiera odpowiedzi D");
                return;
            }
            if(e === ''){
                showError("Pytanie nie zawiera odpowiedzi E");
                return;
            }
        }
        

        axios.post(`http://localhost:8080/pytanie/stworz_pytanie`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200 ) {
            showSucces(response.data.message);
            setPopup3(false);
            setTresc('');
            setA('');
            setB('');
            setC('');
            setD('');
            setE('');
            setF('');
            setApoprawne(false);
            setBpoprawne(false);
            setCpoprawne(false);
            setDpoprawne(false);
            setEpoprawne(false);
            setFpoprawne(false);
            setI(0);
          }
          fetchInfo();
          fetchPytania();
        })
        .catch(error => {
          showError(error.response.data.message);
        });
    }

    function handleSubmit3(event) {
        event.preventDefault();

        const data = {
            tresc: tresc,
            a: a, aPoprawne: apoprawne,
            b: b, bPoprawne: bpoprawne,
            c: c, cPoprawne: cpoprawne,
            d: d, dPoprawne: dpoprawne,
            e: e, ePoprawne: epoprawne,
            f: f, fPoprawne: fpoprawne
        };

        if (tresc === ''){delete data.tresc;}
        if (a === ''){delete data.a;}
        if (b === ''){delete data.b;}
        if (c === ''){delete data.c;}
        if (d === ''){delete data.d;}
        if (e === ''){delete data.e;}
        if (f === ''){delete data.f;}

        if(i === 0){
            data.c = null
            data.d = null
            data.e = null
            data.f = null 
        }
        if(i === 1){
            data.d = null
            data.e = null
            data.f = null 
        }
        if(i === 2){
            data.e = null
            data.f = null 
        }
        if(i === 3){
            data.f = null 
        }

        if (tresc.length > 200) {
            showError("Treść nie może zawierać więcej niż 200 znaków");
            return;
        }

        let temp = 0;
        for (let i = 0; i < data.length; i++){
            if(data[i].length > 50)temp++;
        }
    
        if (temp > 0) {
            showError("Odpowiedź nie może zawierać więcej niż 50 znaków");
            return;
        }

        if(c !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
        }

        if(d !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
        }

        if(e !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
            if(d === ''){
                showError("Pytanie nie zawiera odpowiedzi D");
                return;
            }
        }

        if(f !== ''){
            if(a === ''){
                showError("Pytanie nie zawiera odpowiedzi A");
                return;
            }
            if(b === ''){
                showError("Pytanie nie zawiera odpowiedzi B");
                return;
            }
            if(c === ''){
                showError("Pytanie nie zawiera odpowiedzi C");
                return;
            }
            if(d === ''){
                showError("Pytanie nie zawiera odpowiedzi D");
                return;
            }
            if(e === ''){
                showError("Pytanie nie zawiera odpowiedzi E");
                return;
            }
        }
        

        axios.put(`http://localhost:8080/pytanie/edytuj_pytanie/?pytanieID=${pytanieID}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200 ) {
            showSucces(response.data.message);
            setPopup4(false);
            setTresc('');
            setA('');
            setB('');
            setC('');
            setD('');
            setE('');
            setF('');
            setApoprawne(false);
            setBpoprawne(false);
            setCpoprawne(false);
            setDpoprawne(false);
            setEpoprawne(false);
            setFpoprawne(false);
            setI(0);
          }
          fetchInfo();
          fetchPytania();
        })
        .catch(error => {
          showError(error.response.data.message);
        });
    }

    const pytaniaForCurrentPage = pytania.slice(currentPage * 4, (currentPage + 1) * 4);

    const handlePageChange = (page) => {
        setCurrentPage(page.selected);
    };

    function resetForm(){
        setTresc('');
        setA('');
        setB('');
        setC('');
        setD('');
        setE('');
        setF('');
        setApoprawne(false);
        setBpoprawne(false);
        setCpoprawne(false);
        setDpoprawne(false);
        setEpoprawne(false);
        setFpoprawne(false);
        setI(0);
    }

    function usunOdp(){
        if(i === 4){
            setF('');
            setFpoprawne(false);
        }
        if(i === 3){
            setE('');
            setEpoprawne(false);
        }
        if(i === 2){
            setD('');
            setDpoprawne(false);
        }
        if(i === 1){
            setC('');
            setCpoprawne(false);
        }
        setI(i-1);
    }

    function fix(pytanie){
        let j = 0;
        if(pytanie.c !== null){
            j++;
        }else{
            setC('');
        }
        if(pytanie.d !== null){
            j++;
        }else{
            setD('');
        }
        if(pytanie.e !== null){
            j++;
        }else{
            setE('');
        }
        if(pytanie.f !== null){
            j++;
        }else{
            setF('');
        }
        setI(i+j);
    } 

    if (pytania.length === 0){
        return(
            <div className="main-background">
            <Popup trigger={popup3} setTrigger={setPopup3}>
            <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup3(false); resetForm()}}><VscClose size={25}/></button>
                <form className="custom-form2" onSubmit={handleSubmit2}>
                    <label className="custom-label">
                        Treść pytania <label style={{fontWeight:"500", color:"#2a71ce"}} className={tresc.length > 200 ? "red-label" : ""}>[{tresc.length}/200]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={tresc}
                            onChange={(event) => setTresc(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2">
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={apoprawne}
                                onChange={(event) => setApoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź A <label style={{fontWeight:"500", color:"#2a71ce"}} className={a.length > 50 ? "red-label" : ""}>[{a.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={a}
                            onChange={(event) => setA(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2">
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={bpoprawne}
                                onChange={(event) => setBpoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź B <label style={{fontWeight:"500", color:"#2a71ce"}} className={b.length > 50 ? "red-label" : ""}>[{b.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={b}
                            onChange={(event) => setB(event.target.value)}
                        />
                    </label>
                    <br />
                    <div className={ i < 1 ? "c-container-off" : "c-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={cpoprawne}
                                    onChange={(event) => setCpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź C <label style={{fontWeight:"500", color:"#2a71ce"}} className={c.length > 50 ? "red-label" : ""}>[{c.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={c}
                                onChange={(event) => setC(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 2 ? "d-container-off" : "d-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={dpoprawne}
                                    onChange={(event) => setDpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź D <label style={{fontWeight:"500", color:"#2a71ce"}} className={d.length > 50 ? "red-label" : ""}>[{d.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={d}
                                onChange={(event) => setD(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 3 ? "e-container-off" : "e-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={epoprawne}
                                    onChange={(event) => setEpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź E <label style={{fontWeight:"500", color:"#2a71ce"}} className={e.length > 50 ? "red-label" : ""}>[{e.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={e}
                                onChange={(event) => setE(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 4 ? "f-container-off" : "f-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={fpoprawne}
                                    onChange={(event) => setFpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź F <label style={{fontWeight:"500", color:"#2a71ce"}} className={f.length > 50 ? "red-label" : ""}>[{f.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={f}
                                onChange={(event) => setF(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className="button-container">
                        <button className="custom-button10" type="button" onClick={() => i < 4 ? setI(i+1) : showError("Pytanie może mieć maksymalnie 6 odpowiedzi")}>Dodaj Odpowiedź</button>
                        <button className="custom-button" type="submit">Stwórz pytanie</button>
                        <button className="custom-button10" type="button" onClick={() => i > 0 ? setI(i-1) : showError("Pytanie musi mieć co najmniej 2 odpowiedzi")}>Usuń Odpowiedź</button>
                    </div>
                    <label className="custom-label5">Jeśli odpowiedź jest poprawna należy znaznaczyć pole znajdujące się obok</label>
                </form>
            </Popup>
                <NavbarN />
                <ToastContainer />
                <div className="back">
                <div className="container2">
                    <label className="custom-label3">
                    W tej puli nie ma jeszcze żadnych pytań...
                    </label>
                    <button type="button" className="custom-button9" onClick={() => setPopup3(true)}>Stwórz nowe pytanie</button>
                </div>
                </div>
            </div>
        );
    }

    

    return (
        <div className="main-background">
            <Popup trigger={popup} setTrigger={setPopup}>
                <form className="custom-form" onSubmit={handleSubmit}>
                    <label className="custom-label">
                        Wprowadź nową nazwę <label style={{fontWeight:"500", color:"#2a71ce"}} className={nowaNazwa.length > 20 ? "red-label" : ""}>[{nowaNazwa.length}/20]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={nowaNazwa}
                            onChange={(event) => setNowaNazwa(event.target.value)}
                        />
                    </label>
                    <br />
                    <button className="custom-button" type="submit">Zapisz</button>
                </form>
            </Popup>
            <Popup trigger={popup2} setTrigger={setPopup2}>
                <div className="popup-inside">
                    <label className="custom-label" style={{fontWeight:"500"}}>
                        Czy na pewno chcesz usunąć pytanie?
                    </label>
                    <br />
                    <button className="custom-button3" type="button" onClick={() => handleDelete()}>Usuń</button>
                </div>
            </Popup>
            <Popup trigger={popup3} setTrigger={setPopup3}>
                <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup3(false); resetForm()}}><VscClose size={25}/></button>
                <form className="custom-form2" onSubmit={handleSubmit2}>
                    <label className="custom-label">
                        Treść pytania <label style={{fontWeight:"500", color:"#2a71ce"}} className={tresc.length > 200 ? "red-label" : ""}>[{tresc.length}/200]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={tresc}
                            onChange={(event) => setTresc(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2" style={a.length > 9 ? {left:"10px"} : {}}>
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={apoprawne}
                                onChange={(event) => setApoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź A <label style={{fontWeight:"500", color:"#2a71ce"}} className={a.length > 50 ? "red-label" : ""}>[{a.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={a}
                            onChange={(event) => setA(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2" style={b.length > 9 ? {left:"10px"} : {}}>
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={bpoprawne}
                                onChange={(event) => setBpoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź B <label style={{fontWeight:"500", color:"#2a71ce"}} className={b.length > 50 ? "red-label" : ""}>[{b.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={b}
                            onChange={(event) => setB(event.target.value)}
                        />
                    </label>
                    <br />
                    <div className={ i < 1 ? "c-container-off" : "c-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2" style={c.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={cpoprawne}
                                    onChange={(event) => setCpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź C <label style={{fontWeight:"500", color:"#2a71ce"}} className={c.length > 50 ? "red-label" : ""}>[{c.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={c}
                                onChange={(event) => setC(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 2 ? "d-container-off" : "d-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2" style={d.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={dpoprawne}
                                    onChange={(event) => setDpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź D <label style={{fontWeight:"500", color:"#2a71ce"}} className={d.length> 50 ? "red-label" : ""}>[{d.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={d}
                                onChange={(event) => setD(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 3 ? "e-container-off" : "e-container"}>
                        <label className="custom-label" style={e.length > 9 ? {left:"10px"} : {}}>
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={epoprawne}
                                    onChange={(event) => setEpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź E <label style={{fontWeight:"500", color:"#2a71ce"}} className={e.length > 50 ? "red-label" : ""}>[{e.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={e}
                                onChange={(event) => setE(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 4 ? "f-container-off" : "f-container"}>
                        <label className="custom-label">
                            <label class={"checkbox-container2"} style={f.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={fpoprawne}
                                    onChange={(event) => setFpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź F <label style={{fontWeight:"500", color:"#2a71ce"}} className={f.length > 50 ? "red-label" : ""}>[{f.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={f}
                                onChange={(event) => setF(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className="button-container">
                        <button className="custom-button10" type="button" onClick={() => i < 4 ? setI(i+1) : showError("Pytanie może mieć maksymalnie 6 odpowiedzi")}>Dodaj Odpowiedź</button>
                        <button className="custom-button" type="submit">Stwórz pytanie</button>
                        <button className="custom-button10" type="button" onClick={() => i > 0 ? usunOdp() : showError("Pytanie musi mieć co najmniej 2 odpowiedzi")}>Usuń Odpowiedź</button>
                    </div>
                    <label className="custom-label5">Jeśli odpowiedź jest poprawna należy znaznaczyć pole znajdujące się obok</label>
                </form>
            </Popup>
            <Popup trigger={popup4} setTrigger={setPopup4}>
                <button className="custom-button7" style={{zIndex:"10"}} onClick={() => {setPopup4(false); resetForm()}}><VscClose size={25}/></button>
                <form className="custom-form2" onSubmit={handleSubmit3}>
                    <label className="custom-label">
                        Treść pytania <label style={{fontWeight:"500", color:"#2a71ce"}} className={tresc.length > 200 ? "red-label" : ""}>[{tresc.length}/200]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={tresc}
                            onChange={(event) => setTresc(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2" style={a.length > 9 ? {left:"10px"} : {}}>
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={apoprawne}
                                onChange={(event) => setApoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź A <label style={{fontWeight:"500", color:"#2a71ce"}} className={a.length > 50 ? "red-label" : ""}>[{a.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={a}
                            onChange={(event) => setA(event.target.value)}
                        />
                    </label>
                    <br />
                    <label className="custom-label">
                        <label class="checkbox-container2" style={b.length > 9 ? {left:"10px"} : {}}>
                            <input
                                className="custom-input"
                                type="checkbox"
                                checked={bpoprawne}
                                onChange={(event) => setBpoprawne(event.target.checked)}
                            />
                            <span class="checkmark"></span>
                        </label>
                        I I Odpowiedź B <label style={{fontWeight:"500", color:"#2a71ce"}} className={b.length > 50 ? "red-label" : ""}>[{b.length}/50]</label>
                        <input
                            className="custom-input"
                            type="text"
                            value={b}
                            onChange={(event) => setB(event.target.value)}
                        />
                    </label>
                    <br />
                    <div className={ i < 1 ? "c-container-off" : "c-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2" style={c.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={cpoprawne}
                                    onChange={(event) => setCpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź C <label style={{fontWeight:"500", color:"#2a71ce"}} className={c.length > 50 ? "red-label" : ""}>[{c.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={c}
                                onChange={(event) => setC(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 2 ? "d-container-off" : "d-container"}>
                        <label className="custom-label">
                            <label class="checkbox-container2" style={d.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={dpoprawne}
                                    onChange={(event) => setDpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź D <label style={{fontWeight:"500", color:"#2a71ce"}} className={d.length > 50 ? "red-label" : ""}>[{d.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={d}
                                onChange={(event) => setD(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 3 ? "e-container-off" : "e-container"}>
                        <label className="custom-label" style={e.length > 9 ? {left:"10px"} : {}}>
                            <label class="checkbox-container2">
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={epoprawne}
                                    onChange={(event) => setEpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź E <label style={{fontWeight:"500", color:"#2a71ce"}} className={e.length > 50 ? "red-label" : ""}>[{e.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={e}
                                onChange={(event) => setE(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className={ i < 4 ? "f-container-off" : "f-container"}>
                        <label className="custom-label">
                            <label class={"checkbox-container2"} style={f.length > 9 ? {left:"10px"} : {}}>
                                <input
                                    className="custom-input"
                                    type="checkbox"
                                    checked={fpoprawne}
                                    onChange={(event) => setFpoprawne(event.target.checked)}
                                />
                                <span class="checkmark"></span>
                            </label>
                            I I Odpowiedź F <label style={{fontWeight:"500", color:"#2a71ce"}} className={f.length > 50 ? "red-label" : ""}>[{f.length}/50]</label>
                            <input
                                className="custom-input"
                                type="text"
                                value={f}
                                onChange={(event) => setF(event.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div className="button-container">
                        <button className="custom-button10" type="button" onClick={() => i < 4 ? setI(i+1) : showError("Pytanie może mieć maksymalnie 6 odpowiedzi")}>Dodaj Odpowiedź</button>
                        <button className="custom-button" type="submit">Zapisz zmiany</button>
                        <button className="custom-button10" type="button" onClick={() => i > 0 ? usunOdp() : showError("Pytanie musi mieć co najmniej 2 odpowiedzi")}>Usuń Odpowiedź</button>
                    </div>
                    <label className="custom-label5">Jeśli odpowiedź jest poprawna należy znaznaczyć pole znajdujące się obok</label>
                </form>
            </Popup>
            <NavbarN />
            <ToastContainer />
            <Container className="pytania-container">
                <Container className="card-container">
                <button type="button" className="custom-button4" onClick={() => setPopup3(true)}>Stwórz nowe pytanie</button>
                <label className="custom-label4" style={{top:'50px'}}>
                    Pula: <span style={{ fontWeight:"normal" }}>{nazwa}</span><button type="button" className="custom-button6" onClick={() => {setPopup(true); setNowaNazwa(nazwa)}}><HiOutlinePencilAlt /></button>
                </label>
                <label className="custom-label4" style={{top:'77px'}}>
                    Ilość pytań: <span style={{ fontWeight:"normal" }}>{ilosc}</span>
                </label>
                <Row >
                    {pytaniaForCurrentPage.map((pytanie) => (
                        <Col key={pytanie.pytanieID} xs={3} style={{marginBottom: "20px"}}>
                            <Card className="card-custom2">
                            <Card.Body className="card-body2" style={{overflow:"auto"}}>  
                                <Card.Title className="custom-cardtitle">
                                    {pytanie.tresc}
                                    <hr style={{borderRadius:"3px"}}/>
                                </Card.Title>
                                <Card.Text className={
                                    pytanie.a === null ? 'custom-cardtext-null' : pytanie.apoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>A: {pytanie.a}
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.b === null ? 'custom-cardtext-null' : pytanie.bpoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>B: {pytanie.b}
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.c === null ? 'custom-cardtext-null' : pytanie.cpoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>C: {pytanie.c}
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.d === null ? 'custom-cardtext-null' : pytanie.dpoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>D: {pytanie.d}
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.e === null ? 'custom-cardtext-null' : pytanie.epoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>E: {pytanie.e}
                                </Card.Text>
                                <Card.Text className={
                                    pytanie.f === null ? 'custom-cardtext-null' : pytanie.fpoprawne === true ? 'custom-cardtext-true' : 'custom-cardtext'}>F: {pytanie.f}
                                </Card.Text>
                            </Card.Body>
                            <button type="button" className="custom-button2" style={{width:"250px", alignSelf:"center"}} onClick={() => {
                                setPopup4(true); setPytanieID(pytanie.pytanieID);setTresc(pytanie.tresc);setA(pytanie.a);setB(pytanie.b);setC(pytanie.c);
                                setD(pytanie.d);setE(pytanie.e);setF(pytanie.f);setApoprawne(pytanie.apoprawne);setBpoprawne(pytanie.bpoprawne);
                                setCpoprawne(pytanie.cpoprawne);setDpoprawne(pytanie.dpoprawne);setEpoprawne(pytanie.epoprawne);setFpoprawne(pytanie.fpoprawne);fix(pytanie)}}>Edytuj pytanie</button>
                            <button type="button" className="custom-button3" style={{marginBottom:"20px", width:"250px", alignSelf:"center"}} onClick={() => {setPopup2(true); setPytanieID(pytanie.pytanieID)}}>Usuń pytanie</button>
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
