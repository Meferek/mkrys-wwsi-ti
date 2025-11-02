import AddNewMemberForm from "@/components/forms/AddNewMemberForm";
import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Imię i nazwisko', flex: 1, minWidth: 170 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { 
        field: 'activeLoans', 
        headerName: 'Aktywne wypożyczenia', 
        width: 180,
        align: 'center',
        headerAlign: 'center'
    },
    { 
        field: 'createdAt', 
        headerName: 'Data dodania', 
        width: 150,
        type: 'date'
    },
];

export default function Page() {
    return (
        <>
            <Card title="Członkowie biblioteki" subtitle="Lista zarejestrowanych członków"></Card>

            <Table 
                fetchURL="/api/lab1/members"
                columns={ columns }
            />

            <Card title="Dodaj nowego członka" subtitle="Formularz rejestracji członka">
                <AddNewMemberForm />
            </Card>
        </>
    );
}
