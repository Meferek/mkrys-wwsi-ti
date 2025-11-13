'use client';

import AddNewProductForm from "@/components/forms/AddNewProductForm";
import AddToCartButton from "@/components/forms/AddToCartButton";
import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import Cart from "@/components/other/Cart";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const ProductsPage = () => {
    const [cartKey, setCartKey] = useState(0);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nazwa produktu', flex: 1, minWidth: 200 },
        { 
            field: 'price', 
            headerName: 'Cena', 
            width: 150,
            valueFormatter: (value: number) => `${value?.toFixed(2)} zł`
        },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <AddToCartButton 
                    productId={params.row.id}
                    productName={params.row.name}
                    onSuccess={() => setCartKey(prev => prev + 1)}
                />
            )
        }
    ];

    return (
        <>
            <Card title="Produkty w sklepie" subtitle="Lista dostępnych produktów"></Card>

            <Table 
                fetchURL="/api/lab2/products"
                columns={ columns }
            />

            <Card title="Koszyk" subtitle="Zarządzaj swoim koszykiem">
                <Cart key={cartKey} />
            </Card>

            <Card title="Dodaj nowy produkt" subtitle="Formularz dodawania produktu">
                <AddNewProductForm />
            </Card>
        </>
    );
}

export default ProductsPage;
