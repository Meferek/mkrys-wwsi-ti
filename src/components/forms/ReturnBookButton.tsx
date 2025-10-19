'use client';

import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ReturnBookForm from './ReturnBookForm';

interface ReturnBookButtonProps {
    loanId: string;
}

const ReturnBookButton = ({ loanId }: ReturnBookButtonProps) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleSuccess = () => {
        setOpenDialog(false);
        // SWR automatycznie odświeży dane
    };

    return (
        <>
            <Button 
                variant="outlined" 
                size="small"
                onClick={() => setOpenDialog(true)}
            >
                Zwróć
            </Button>

            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Zwróć książkę</DialogTitle>
                <DialogContent>
                    <ReturnBookForm 
                        loanId={loanId} 
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReturnBookButton;
