'use client';

import { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { plPL } from '@mui/x-data-grid/locales';
import { fetchDataGET } from "@/lib/fetch/fetchDataGET";
import useSWR from 'swr';

type Props = {
    fetchURL: string;
    columns: GridColDef[];
    refreshInterval?: number;
}

const Table = ({ fetchURL, columns, refreshInterval = 0 }: Props) => {

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const processedColumns = columns.map(column => {
        if (column.type === 'date' || column.type === 'dateTime') {
            return {
                ...column,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                valueGetter: (params: any) => {
                    if (!params || params.value == null) return null;
                    const value = params.value;
                    return value ? new Date(value as string | number | Date) : null;
                }
            };
        }
        return column;
    });
    
    const fetcher = async (url: string) => {
        const response = await fetchDataGET(url);
        return response;
    };

    const urlWithParams = `${fetchURL}${fetchURL.includes('?') ? '&' : '?'}page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`;

    const { data: response, error, isLoading } = useSWR(
        urlWithParams, 
        fetcher,
        {
            refreshInterval: refreshInterval,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            revalidateOnMount: true,
            dedupingInterval: 500,
        }
    );

    const data = response?.data || [];
    const totalCount = response?.totalCount || 0;

    const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    if (error) {
        console.error("Błąd podczas pobierania danych:", error);
    }

    return (
        <DataGrid
            getRowId={ (row) => row.id }
            rows={ data }
            columns={ processedColumns }
            rowCount={ totalCount }
            paginationModel={ paginationModel }
            onPaginationModelChange={ handlePaginationModelChange }
            paginationMode="server"
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            localeText={ plPL.components.MuiDataGrid.defaultProps.localeText }
            filterMode="client"
            style={{ 
                minHeight: '400px',
                height: 'auto',
                width: '100%'
            }} 
            loading={ isLoading }
            slotProps={{
                loadingOverlay: {
                    variant: 'circular-progress',
                    noRowsVariant: 'circular-progress',
                },
            }}
            className="border-1 border-royal-blue-700/30 rounded-2xl overflow-hidden"
            sx={{
                border: 'none',
                backgroundColor: 'white',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'white',
                    height: '80px !important',
                    minHeight: '80px !important',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#d1d5db',
                    }
                },
                '& .MuiDataGrid-columnHeadersInner': {
                    borderBottom: '1px solid #d1d5db !important',
                },
                '& .MuiDataGrid-columnHeader': {
                    border: 'none',
                    backgroundColor: 'white',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    height: '80px !important',
                    borderRight: '1px solid #d1d5db',
                    '&:last-child': {
                        borderRight: 'none',
                    },
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                    color: 'oklch(39.96% 0.1 269.74)',
                },
                '& .MuiDataGrid-row': {
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: 'oklch(97.21% 0.01 244.25)',
                    },
                },
                '& .MuiDataGrid-cell': {
                    border: 'none',
                    color: 'oklch(39.96% 0.1 269.74)',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                },
                '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                    borderBottom: 'none',
                },
                '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #d1d5db',
                    backgroundColor: 'white',
                },
                '& .MuiTablePagination-root': {
                    color: 'oklch(39.96% 0.1 269.74)',
                },
                '& .MuiDataGrid-selectedRowCount': {
                    color: 'oklch(39.96% 0.1 269.74)',
                },
            }}
        />
    );
}

export default Table;