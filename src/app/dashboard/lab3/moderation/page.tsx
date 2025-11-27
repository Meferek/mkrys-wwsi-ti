'use client';

import useSWR from 'swr';
import Card from "@/components/global/Card";
import ApproveCommentButton from "@/components/forms/ApproveCommentButton";
import { CircularProgress, Alert, Typography, Divider, Box, Chip } from "@mui/material";
import { fetchDataGET } from "@/lib/fetch/fetchDataGET";
import Link from "next/link";

interface Comment {
    id: string;
    author: string;
    body: string;
    createdAt: string;
    approved: number;
    post: {
        id: string;
        title: string;
    };
}

interface PendingCommentsResponse {
    data: Comment[];
}

const ModerationPage = () => {
    const { data, error, isLoading } = useSWR<PendingCommentsResponse>('/api/lab3/comments/pending', fetchDataGET);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Card title="Błąd">
                <Alert severity="error">Nie udało się pobrać oczekujących komentarzy</Alert>
            </Card>
        );
    }

    const pendingComments = data?.data || [];

    return (
        <>
            <Card 
                title="Panel moderacji" 
                subtitle={`Komentarze oczekujące na zatwierdzenie (${pendingComments.length})`}
            >
                {pendingComments.length === 0 ? (
                    <Alert severity="success">Brak komentarzy oczekujących na moderację! 🎉</Alert>
                ) : (
                    <Box>
                        {pendingComments.map((comment, index) => (
                            <Box key={comment.id}>
                                <Box sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {comment.author}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.createdAt).toLocaleString('pl-PL')}
                                        </Typography>
                                        <Chip label="Oczekuje" color="warning" size="small" />
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Post: <Link href={`/dashboard/lab3/posts/${comment.post.id}`} className="text-blue-600 hover:underline">
                                            {comment.post.title}
                                        </Link>
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                                        {comment.body}
                                    </Typography>
                                    
                                    <ApproveCommentButton commentId={comment.id} />
                                </Box>
                                {index < pendingComments.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>
                )}
            </Card>
        </>
    );
}

export default ModerationPage;
