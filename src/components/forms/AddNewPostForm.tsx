'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useSWRConfig } from 'swr';

interface PostFormData {
    title: string;
    body: string;
}

const AddNewPostForm = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate } = useSWRConfig();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>();

    const onSubmit = async (data: PostFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST('/api/lab3/posts', data as unknown as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Post został dodany pomyślnie!');
                reset();
                mutate((key) => typeof key === 'string' && key.startsWith('/api/lab3/posts'));
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas dodawania posta');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas dodawania posta');
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
                label="Treść *"
                fullWidth
                margin="normal"
                multiline
                rows={6}
                {...register('body', { required: 'Treść jest wymagana' })}
                error={!!errors.body}
                helperText={errors.body?.message}
                size='small'
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Dodaj post'}
            </Button>
        </Box>
    );
};

export default AddNewPostForm;
