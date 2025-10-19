import AddNewBookForm from "@/components/forms/AddNewBookForm";
import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: 'title', headerName: 'Tytuł', flex: 1, minWidth: 200 },
    { field: 'author', headerName: 'Autor', flex: 1, minWidth: 150 },
    { field: 'isbn', headerName: 'ISBN', width: 150 },
    { field: 'year', headerName: 'Rok', width: 100 },
    { 
        field: 'copies', 
        headerName: 'Liczba egzemplarzy', 
        width: 150,
        align: 'center',
        headerAlign: 'center'
    },
    { 
        field: 'availableCopies', 
        headerName: 'Dostępne', 
        width: 120,
        align: 'center',
        headerAlign: 'center'
    },
    { 
        field: 'loanedCopies', 
        headerName: 'Wypożyczone', 
        width: 120,
        align: 'center',
        headerAlign: 'center'
    },
];

export default function Page() {
    return (
        <>
            <Card title="Książki dostępne w systemie" subtitle="Lista dostępnych książek"></Card>

            <Table 
                fetchURL="/api/books"
                columns={ columns }
            />

            <Card title="Dodaj nową książkę" subtitle="Formularz dodawania książki">
                <AddNewBookForm />
            </Card>

        </>
    );
}
