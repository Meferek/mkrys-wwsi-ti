'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';

interface AddToCartButtonProps {
    productId: string;
    productName: string;
    onSuccess?: () => void;
}

const AddToCartButton = ({ productId, productName, onSuccess }: AddToCartButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);

        try {
            const response = await fetchDataPOST('/api/lab2/cart/add', {
                product_id: productId,
                qty: 1
            });

            if (response.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Błąd:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddToCart}
            disabled={loading}
            size="small"
        >
            {loading ? <CircularProgress size={20} /> : 'Dodaj do koszyka'}
        </Button>
    );
}

export default AddToCartButton;
