'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, TextField, IconButton, Alert, CircularProgress, Card as MuiCard, CardContent } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fetchDataGET } from '@/lib/fetch/fetchDataGET';
import { fetchDataPATCH } from '@/lib/fetch/fetchDataPATCH';
import { fetchDataDELETE } from '@/lib/fetch/fetchDataDELETE';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import useSWR from 'swr';

interface CartItem {
    product_id: string;
    qty: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetcher = async (url: string) => {
        const response = await fetchDataGET(url);
        return response;
    };

    const { data: cartResponse, mutate } = useSWR('/api/lab2/cart', fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: true,
        revalidateOnMount: true,
    });

    const { data: productsResponse } = useSWR('/api/lab2/products?pageSize=1000', fetcher);

    const cart: CartItem[] = cartResponse?.data || [];
    const products: Product[] = productsResponse?.data || [];

    const handleUpdateQty = async (productId: string, qty: number) => {
        if (qty <= 0) return;

        try {
            await fetchDataPATCH('/api/lab2/cart/item', {
                product_id: productId,
                qty
            });
            mutate();
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            await fetchDataDELETE(`/api/lab2/cart/item/${productId}`, {});
            mutate();
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST('/api/lab2/checkout', {});

            if (response.status === 201) {
                setSuccessMessage(`Zamówienie zostało złożone! ID: ${response.data.order_id}, Total: ${response.data.total.toFixed(2)} zł`);
                mutate();
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas składania zamówienia');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas składania zamówienia');
        } finally {
            setLoading(false);
        }
    };

    const cartItems = useMemo(() => {
        return cart.map(item => {
            const product = products.find(p => p.id === item.product_id);
            return {
                ...item,
                product
            };
        });
    }, [cart, products]);

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            if (!item.product) return sum;
            return sum + (item.product.price * item.qty);
        }, 0);
    }, [cartItems]);

    if (cart.length === 0) {
        return (
            <MuiCard className="border-1 border-royal-blue-700/30 rounded-2xl">
                <CardContent>
                    <Typography>Koszyk jest pusty</Typography>
                </CardContent>
            </MuiCard>
        );
    }

    return (
        <MuiCard className="border-1 border-royal-blue-700/30 rounded-2xl">
            <CardContent>
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {cartItems.map(item => (
                        <Box 
                            key={item.product_id}
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" fontWeight={600}>
                                    {item.product?.name || 'Ładowanie...'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.product ? `${item.product.price.toFixed(2)} zł` : ''}
                                </Typography>
                            </Box>

                            <TextField
                                type="number"
                                size="small"
                                value={item.qty}
                                onChange={(e) => handleUpdateQty(item.product_id, parseInt(e.target.value))}
                                inputProps={{ min: 1, style: { width: '60px' } }}
                            />

                            <Typography variant="body1" sx={{ minWidth: '80px', textAlign: 'right' }}>
                                {item.product ? `${(item.product.price * item.qty).toFixed(2)} zł` : ''}
                            </Typography>

                            <IconButton 
                                color="error" 
                                onClick={() => handleRemove(item.product_id)}
                                size="small"
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Box>
                    ))}

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 2,
                        borderTop: '2px solid',
                        borderColor: 'divider'
                    }}>
                        <Typography variant="h6" fontWeight={700}>
                            Suma:
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {total.toFixed(2)} zł
                        </Typography>
                    </Box>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        sx={{ mt: 1 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Zamów'}
                    </Button>
                </Box>
            </CardContent>
        </MuiCard>
    );
};

export default Cart;
