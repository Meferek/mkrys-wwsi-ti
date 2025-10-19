'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useSWRConfig } from 'swr';

interface BookFormData {
    title: string;
    author: string;
    copies: number;
    isbn?: string;
    year?: string;
    publisher?: string;
    [key: string]: string | number | undefined;
}

const AddNewBookForm = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate } = useSWRConfig();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BookFormData>({
        defaultValues: {
            copies: 1
        }
    });

    const onSubmit = async (data: BookFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST('/api/books', data as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Książka została dodana pomyślnie!');
                reset();
                mutate((key) => typeof key === 'string' && key.startsWith('/api/books'));
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas dodawania książki');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas dodawania książki');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <TextField
                label="Tytuł *"
                fullWidth
                margin="normal"
                {...register('title', { required: 'Tytuł jest wymagany' })}
                error={!!errors.title}
                helperText={errors.title?.message}
                size='small'
            />

            <TextField
                label="Autor *"
                fullWidth
                margin="normal"
                {...register('author', { required: 'Autor jest wymagany' })}
                error={!!errors.author}
                helperText={errors.author?.message}
                size='small'
            />

            <TextField
                label="Liczba egzemplarzy"
                type="number"
                fullWidth
                margin="normal"
                defaultValue={1}
                {...register('copies', { 
                    valueAsNumber: true,
                    min: { value: 1, message: 'Liczba egzemplarzy musi być większa od 0' }
                })}
                error={!!errors.copies}
                helperText={errors.copies?.message}
                size='small'
            />

            <TextField
                label="ISBN"
                fullWidth
                margin="normal"
                {...register('isbn')}
                size='small'
            />

            <TextField
                label="Rok wydania"
                fullWidth
                margin="normal"
                {...register('year')}
                size='small'
            />

            <TextField
                label="Wydawnictwo"
                fullWidth
                margin="normal"
                {...register('publisher')}
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
                {loading ? <CircularProgress size={24} /> : 'Dodaj książkę'}
            </Button>
        </Box>
    );
}

export default AddNewBookForm;