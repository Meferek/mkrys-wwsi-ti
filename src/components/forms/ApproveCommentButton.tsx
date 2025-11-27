'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { fetchDataPOST } from '@/lib/fetch/fetchDataPOST';
import { useSWRConfig } from 'swr';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ApproveCommentButtonProps {
    commentId: string;
}

const ApproveCommentButton = ({ commentId }: ApproveCommentButtonProps) => {
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();

    const handleApprove = async () => {
        setLoading(true);

        try {
            const response = await fetchDataPOST(`/api/lab3/comments/${commentId}/approve`, {});

            if (response.status === 200) {
                mutate((key) => typeof key === 'string' && key.includes('/comments'));
            }
        } catch (error) {
            console.error('Błąd podczas zatwierdzania komentarza:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="contained" 
            color="success" 
            size="small"
            onClick={handleApprove}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleOutlineIcon />}
        >
            {loading ? 'Zatwierdzam...' : 'Zatwierdź'}
        </Button>
    );
};

export default ApproveCommentButton;
