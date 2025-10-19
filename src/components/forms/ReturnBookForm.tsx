'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { fetchDataPATCH } from '@/lib/fetch/fetchDataPATCH';
import { useSWRConfig } from 'swr';

interface ReturnFormData {
    loanId: string;
    returnDate?: string;
}

interface ReturnBookFormProps {
    loanId: string;
    onSuccess?: () => void;
}

const ReturnBookForm = ({ loanId, onSuccess }: ReturnBookFormProps) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate } = useSWRConfig();

    const { control, handleSubmit } = useForm<ReturnFormData>({
        defaultValues: {
            loanId: loanId,
            returnDate: new Date().toISOString().split('T')[0]
        }
    });

    const onSubmit = async (data: ReturnFormData) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetchDataPATCH(
                `/api/loans/${loanId}/return`, 
                { returnDate: data.returnDate } as Record<string, unknown>
            );

            if (response.status === 200) {
                setSuccessMessage('Książka została zwrócona pomyślnie!');
                
                mutate((key) => typeof key === 'string' && (key.startsWith('/api/books') || key.startsWith('/api/loans')));
                
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            } else {
                setErrorMessage(response.error || 'Wystąpił błąd podczas zwrotu książki');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas zwrotu książki');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Controller
                name="returnDate"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Data zwrotu"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        size='small'
                    />
                )}
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Potwierdź zwrot'}
            </Button>
        </Box>
    );
}

export default ReturnBookForm;
