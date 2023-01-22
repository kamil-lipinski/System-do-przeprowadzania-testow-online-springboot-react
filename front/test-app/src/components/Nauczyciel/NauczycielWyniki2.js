import React, { useState, useEffect, useCallback } from 'react';
import NavbarN from './NavbarN';
import './nauczycieltesty.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip } from 'react-toastify';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import FilterComponent from "./FilterComponent";
import './nauczycielwyniki.css';

function NauczycielWyniki2() {
    const currentUrl = window.location.search;
    const testID = new URLSearchParams(currentUrl).get('testID');
    const [wyniki, setWyniki] = useState([]);
    const token = sessionStorage.getItem('token');

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

    const fetchWyniki = useCallback(async () => {
        axios.get(`http://localhost:8080/wynik/wyswietl_wyniki_n2/?testID=${testID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setWyniki(response.data);
        })
        .catch(error => {
            showError(error);
        });
    }, [token, testID]);

    useEffect(() => {
        fetchWyniki();
    }, [fetchWyniki]);


    const sortedWyniki = wyniki.sort((a, b) => {
        return b.wynik - a.wynik;
    });

    const columns = [
        {
            name: 'Imię',
            selector: row => row.imie,
            sortable: true,
        },
        {
            name: 'Nazwisko',
            selector: row => row.nazwisko,
            sortable: true,
        },
        {
            name: 'Wynik',
            selector: row => row.wynik,
            sortable: true,
        },
    ];

    const data = [];

    for(var i = 0; i < sortedWyniki.length; i++){
        data[i] = {
            id: i+1,
            imie: sortedWyniki[i].uzytkownik.imie,
            nazwisko: sortedWyniki[i].uzytkownik.nazwisko,
            wynik: sortedWyniki[i].wynik,
        }
    }

    const data2 = data.filter(function(item) {
        return item.wynik !== -1;
    });

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    
    const filteredItems = data2.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

	const subHeaderComponent = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);
    
    return (
        <div className="main-background">
            <NavbarN/>
            <ToastContainer/>
            <div style={{marginTop:"150px", width:"80%"}}>
                {/* <div style={{height:"10px"}}/> */}
                <label className="custom-label4" style={{top:'116px', zIndex:"10"}}>
                    <span style={{ fontWeight: "500" }}>Test: </span><span style={{ fontWeight:"normal" }}>{wyniki[0]?.test.nazwa || ''}</span>
                </label>
                <label className="custom-label4" style={{top:'143px', zIndex:"10"}}>
                    <span style={{ fontWeight: "500" }}>Data: </span><span style={{ fontWeight:"normal" }}>{wyniki[0]?.test.data || ''}</span>
                </label>
                <label className="custom-label4" style={{top:'170px', zIndex:"10"}}>
                    <span style={{ fontWeight: "500" }}>Punktów do zdobycia: </span><span style={{ fontWeight: "bold", color: "#2a71ce"  }}>{wyniki[0]?.test.iloscPytan || ''}</span>
                </label>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    striped
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    fixedHeader
                    fixedHeaderScrollHeight="552px"
                    noDataComponent="Brak wyników do wyświetlenia..."
                />
            </div>
        </div>
    );
}

export default NauczycielWyniki2;
    
    

