'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useSWRConfig } from 'swr';

interface ProductFormData {
    name: string;
    price: number;
}

const AddNewProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate } = useSWRConfig();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>();

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST('/api/lab2/products', data as unknown as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Produkt został dodany pomyślnie!');
                reset();
                mutate((key) => typeof key === 'string' && key.startsWith('/api/lab2/products'));
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas dodawania produktu');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas dodawania produktu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <TextField
                label="Nazwa produktu *"
                fullWidth
                margin="normal"
                {...register('name', { required: 'Nazwa jest wymagana' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                size='small'
            />

            <TextField
                label="Cena *"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ step: '0.01', min: '0' }}
                {...register('price', { 
                    required: 'Cena jest wymagana',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cena nie może być ujemna' }
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                size='small'
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Dodaj produkt'}
            </Button>
        </Box>
    );
}

export default AddNewProductForm;
