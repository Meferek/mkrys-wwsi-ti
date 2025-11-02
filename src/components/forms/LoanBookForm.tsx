'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    TextField, 
    Button, 
    Box, 
    Alert, 
    CircularProgress,
    Autocomplete,
    Typography
} from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { fetchDataGET } from '@/lib/fetch/fetchDataGET';
import { useSWRConfig } from 'swr';
import useSWR from 'swr';

interface LoanFormData {
    memberId: string;
    bookId: string;
    loanDate?: string;
    dueDate?: string;
}

interface Member {
    id: string;
    name: string;
    email: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    availableCopies: number;
}

interface LoanBookFormProps {
    onSuccess?: () => void;
}

const LoanBookForm = ({ onSuccess }: LoanBookFormProps = {}) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [realtimeAvailability, setRealtimeAvailability] = useState<{
        availableCopies: number;
        activeLoans: number;
        totalCopies: number;
        isAvailable: boolean;
    } | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const { mutate } = useSWRConfig();

    const fetcher = async (url: string) => {
        const response = await fetchDataGET(url);
        return response;
    };

    const { data: membersResponse, isLoading: loadingMembers } = useSWR('/api/lab1/members', fetcher, {
        revalidateOnFocus: true,
        revalidateOnMount: true,
    });
    const { data: booksResponse, isLoading: loadingBooks } = useSWR('/api/lab1/books', fetcher, {
        revalidateOnFocus: true,
        revalidateOnMount: true,
    });

    const members = membersResponse?.data || [];
    const allBooks = booksResponse?.data || [];
    
    const books = allBooks.filter((book: Book) => book.availableCopies > 0);
    const loadingData = loadingMembers || loadingBooks;

    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<LoanFormData>({
        defaultValues: {
            loanDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    });

    const selectedBookId = watch('bookId');
    const selectedBook = books.find((book: Book) => book.id === selectedBookId);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!selectedBookId) {
                setRealtimeAvailability(null);
                return;
            }

            setCheckingAvailability(true);
            try {
                const response = await fetchDataGET(`/api/lab1/books/${selectedBookId}/availability`);
                if (response.status === 200) {
                    setRealtimeAvailability(response.data);
                }
            } catch (error) {
                console.error('Błąd sprawdzania dostępności:', error);
            } finally {
                setCheckingAvailability(false);
            }
        };

        checkAvailability();
    }, [selectedBookId]);

    const onSubmit = async (data: LoanFormData) => {
        
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {

            
            const availabilityResponse = await fetchDataGET(`/api/lab1/books/${data.bookId}/availability`);
            
            if (availabilityResponse.status !== 200) {
                setErrorMessage('Nie udało się sprawdzić dostępności książki');
                setLoading(false);
                return;
            }

            const availability = availabilityResponse.data;

            if (!availability.isAvailable || availability.availableCopies <= 0) {
                setErrorMessage(
                    `Książka "${availability.title}" nie jest już dostępna! ` +
                    `(Aktywne wypożyczenia: ${availability.activeLoans}/${availability.totalCopies})`
                );
                
                await mutate('/api/lab1/books');
                setLoading(false);
                return;
            }

            console.log(`✅ Książka dostępna - wysyłam formularz`);

            const response = await fetchDataPOST('/api/lab1/loans', data as unknown as Record<string, unknown>);

            if (response.status === 201) {
                setSuccessMessage('Książka została wypożyczona pomyślnie!');
                
                await mutate('/api/lab1/books');
                await mutate('/api/lab1/loans');
                
                reset();
                
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            } else if (response.status === 409) {

                setErrorMessage(response.error || 'Książka nie jest już dostępna');
                await mutate('/api/lab1/books');

            } else {

                setErrorMessage(response.error || 'Wystąpił błąd podczas wypożyczania książki');

            }

        } catch (error) {

            console.error('Błąd:', error);
            setErrorMessage('Wystąpił błąd podczas wypożyczania książki');

        } finally {

            setLoading(false);

        }

    };

    if (loadingData) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
        </Box>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Controller
                name="memberId"
                control={control}
                rules={{ required: 'Wybór członka jest wymagany' }}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        options={members}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => `${option.name} (${option.email})`}
                        onChange={(_, data) => onChange(data?.id || '')}
                        value={members.find((m: Member) => m.id === value) || null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Członek *"
                                margin="normal"
                                error={!!errors.memberId}
                                helperText={errors.memberId?.message}
                                size='small'
                            />
                        )}
                    />
                )}
            />

            <Controller
                name="bookId"
                control={control}
                rules={{ required: 'Wybór książki jest wymagany' }}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        options={books}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => `${option.title} - ${option.author} (Dostępne: ${option.availableCopies})`}
                        onChange={(_, data) => onChange(data?.id || '')}
                        value={books.find((b: Book) => b.id === value) || null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Książka *"
                                margin="normal"
                                error={!!errors.bookId}
                                helperText={errors.bookId?.message}
                                size='small'
                            />
                        )}
                    />
                )}
            />

            {selectedBook && realtimeAvailability && (
                <Alert 
                    severity={realtimeAvailability.isAvailable ? "info" : "warning"} 
                    sx={{ mt: 1, mb: 1 }}
                >
                    {checkingAvailability ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            <span>Sprawdzam dostępność...</span>
                        </Box>
                    ) : (
                        <>
                            <strong>Dostępność:</strong> {realtimeAvailability.availableCopies} z {realtimeAvailability.totalCopies} egzemplarzy
                            {!realtimeAvailability.isAvailable && (
                                <Box sx={{ mt: 0.5, color: 'error.main' }}>
                                    ⚠️ Wszystkie egzemplarze są wypożyczone!
                                </Box>
                            )}
                        </>
                    )}
                </Alert>
            )}

            <Controller
                name="loanDate"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Data wypożyczenia"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        size='small'
                    />
                )}
            />

            <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Termin zwrotu"
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
                disabled={
                    loading || 
                    books.length === 0 || 
                    checkingAvailability ||
                    (realtimeAvailability !== null && !realtimeAvailability.isAvailable)
                }
            >
                {loading ? <CircularProgress size={24} /> : 'Wypożycz książkę'}
            </Button>

            {books.length === 0 && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Brak dostępnych książek do wypożyczenia
                </Typography>
            )}
        </Box>
    );
}

export default LoanBookForm;
