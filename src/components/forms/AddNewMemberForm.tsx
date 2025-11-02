'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useSWRConfig } from 'swr';

interface MemberFormData {
    name: string;
    email: string;
}

const AddNewMemberForm = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate } = useSWRConfig();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<MemberFormData>();

    const onSubmit = async (data: MemberFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST('/api/lab1/members', data as unknown as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Członek został dodany pomyślnie!');
                reset();
                mutate((key) => typeof key === 'string' && key.startsWith('/api/lab1/members'));
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas dodawania członka');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas dodawania członka');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <TextField
                label="Imię i nazwisko *"
                fullWidth
                margin="normal"
                {...register('name', { required: 'Imię i nazwisko jest wymagane' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                size='small'
            />

            <TextField
                label="Email *"
                type="email"
                fullWidth
                margin="normal"
                {...register('email', { 
                    required: 'Email jest wymagany',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Nieprawidłowy format adresu email'
                    }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                {loading ? <CircularProgress size={24} /> : 'Dodaj członka'}
            </Button>
        </Box>
    );
}

export default AddNewMemberForm;
