'use client';

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip } from '@mui/material';
import ReturnBookButton from "@/components/forms/ReturnBookButton";

const LoansTableColumns: GridColDef[] = [
    { 
        field: 'memberName', 
        headerName: 'Członek', 
        flex: 1,
        minWidth: 150,
    },
    { 
        field: 'bookTitle', 
        headerName: 'Książka', 
        flex: 1,
        minWidth: 200,
    },
    { 
        field: 'loanDateFormatted', 
        headerName: 'Data wypożyczenia', 
        width: 150,
    },
    { 
        field: 'dueDateFormatted', 
        headerName: 'Termin zwrotu', 
        width: 150,
    },
    { 
        field: 'returnDateFormatted', 
        headerName: 'Data zwrotu', 
        width: 150,
    },
    { 
        field: 'statusLabel', 
        headerName: 'Status', 
        width: 150,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const status = params.value as string;
            if (status === 'overdue') {
                return <Chip label="Przeterminowane" color="error" size="small" />;
            }
            if (status === 'active') {
                return <Chip label="Aktywne" color="success" size="small" />;
            }
            return <Chip label="Zwrócone" color="default" size="small" />;
        }
    },
    {
        field: 'actions',
        headerName: 'Akcje',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => {
            if (params.row.isActive) {
                return <ReturnBookButton loanId={params.row.id} />;
            }
            return null;
        }
    }
];

export default LoansTableColumns;
