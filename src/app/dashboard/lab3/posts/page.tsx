'use client';

import AddNewPostForm from "@/components/forms/AddNewPostForm";
import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from '@mui/icons-material/Visibility';

const PostsPage = () => {
    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Tytuł', flex: 1, minWidth: 300 },
        { 
            field: 'body', 
            headerName: 'Treść', 
            flex: 1, 
            minWidth: 400,
            renderCell: (params) => (
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {params.value}
                </div>
            )
        },
        {
            field: '_count',
            headerName: 'Komentarze',
            width: 150,
            valueGetter: (value: { comments?: number }) => value?.comments || 0,
            renderCell: (params) => (
                <span>{params.value} zatwierdzonych</span>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Data utworzenia',
            width: 180,
            valueFormatter: (value: string) => new Date(value).toLocaleString('pl-PL')
        },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Link href={`/dashboard/lab3/posts/${params.row.id}`}>
                    <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<VisibilityIcon />}
                    >
                        Zobacz
                    </Button>
                </Link>
            )
        }
    ];

    return (
        <>
            <Card title="Blog - Posty" subtitle="Lista wszystkich postów na blogu"></Card>

            <Table 
                fetchURL="/api/lab3/posts"
                columns={ columns }
            />

            <Card title="Dodaj nowy post" subtitle="Formularz dodawania nowego posta">
                <AddNewPostForm />
            </Card>
        </>
    );
}

export default PostsPage;
