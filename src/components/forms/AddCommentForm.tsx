'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useRouter } from 'next/navigation';

interface CommentFormData {
    author: string;
    body: string;
}

interface AddCommentFormProps {
    postId: string;
}

const AddCommentForm = ({ postId }: AddCommentFormProps) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CommentFormData>();

    const onSubmit = async (data: CommentFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPOST(`/api/lab3/posts/${postId}/comments`, data as unknown as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Komentarz został dodany i oczekuje na moderację!');
                reset();
                // Odśwież dane serwera (Server Component)
                router.refresh();
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas dodawania komentarza');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas dodawania komentarza');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

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
                label="Komentarz *"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                {...register('body', { required: 'Komentarz jest wymagany' })}
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
                {loading ? <CircularProgress size={24} /> : 'Dodaj komentarz'}
            </Button>
        </Box>
    );
};

export default AddCommentForm;
