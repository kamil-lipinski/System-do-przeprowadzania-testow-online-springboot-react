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

function NauczycielWyniki() {
    const [wyniki, setWyniki] = useState([]);
    const token = localStorage.getItem('token');

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
        axios.get('http://localhost:8080/wynik/wyswietl_wyniki_n', {
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
    }, [token]);

    useEffect(() => {
        fetchWyniki();
    }, [fetchWyniki]);

    const caseInsensitiveSort = (rowA, rowB) => {
        let [dmyA, timeA] = rowA.data.split(" ");
        let [dayA, monthA, yearA] = dmyA.split("/");
        let [hourA, minuteA, secondA] = timeA.split(":");
        const a = new Date(yearA, monthA - 1, dayA, hourA, minuteA, secondA);
    
        let [dmyB, timeB] = rowB.data.split(" ");
        let [dayB, monthB, yearB] = dmyB.split("/");
        let [hourB, minuteB, secondB] = timeB.split(":");
        const b = new Date(yearB, monthB - 1, dayB, hourB, minuteB, secondB);

        if (a > b) {
            return 1;
        }
    
        if (b > a) {
            return -1;
        }
    
        return 0;
    };

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
            name: 'Test',
            selector: row => row.test,
            sortable: true,
        },
        {
            name: 'Data',
            selector: row => row.data,
            sortable: true,
            sortFunction: caseInsensitiveSort
        },
        {
            name: 'Czas [min]',
            selector: row => row.czas,
            sortable: true,
        },
        {
            name: 'Wynik',
            selector: row => row.wynik,
            sortable: true,
        },
    ];

    const data = [];

    for(var i = 0; i < wyniki.length; i++){
        data[i] = {
            id: i+1,
            imie: wyniki[i].uzytkownik.imie,
            nazwisko: wyniki[i].uzytkownik.nazwisko,
            test: wyniki[i].test.nazwa,
            data: wyniki[i].test.data,
            czas: wyniki[i].test.czas,
            wynik: wyniki[i].wynik,
        }
    }

    const data2 = data.filter(function(item) {
        return item.wynik !== -1;
    });

    const sortedData = data2.sort((a, b) => {
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

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    
    const filteredItems = sortedData.filter(
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
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    defaultSortFieldId="data"
                    defaultSortAsc={true}
                    striped
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    fixedHeader
                    fixedHeaderScrollHeight="552px"
                />
            </div>
        </div>
    );
}

export default NauczycielWyniki;
    
    

