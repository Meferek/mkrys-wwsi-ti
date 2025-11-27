import { prisma } from "@/lib/prisma";
import Card from "@/components/global/Card";
import AddCommentForm from "@/components/forms/AddCommentForm";
import { Alert, Typography, Divider, Box, Chip } from "@mui/material";
import { notFound } from "next/navigation";

interface Comment {
    id: string;
    author: string;
    body: string;
    createdAt: Date;
    approved: number;
}

interface Post {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    comments: Comment[];
}

const PostDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    
    const post = await prisma.posts.findUnique({
        where: { id },
        include: {
            comments: {
                where: {
                    approved: 1
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!post) {
        notFound();
    }

    return (
        <>
            <Card title={post.title} subtitle={`Utworzono: ${post.createdAt.toLocaleString('pl-PL')}`}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                    {post.body}
                </Typography>
            </Card>

            <Card title={`Komentarze (${post.comments.length})`} subtitle="Zatwierdzone komentarze">
                {post.comments.length === 0 ? (
                    <Alert severity="info">Brak zatwierdzonych komentarzy</Alert>
                ) : (
                    <Box>
                        {post.comments.map((comment, index) => (
                            <Box key={comment.id}>
                                <Box sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {comment.author}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {comment.createdAt.toLocaleString('pl-PL')}
                                        </Typography>
                                        <Chip label="Zatwierdzony" color="success" size="small" />
                                    </Box>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {comment.body}
                                    </Typography>
                                </Box>
                                {index < post.comments.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>
                )}
            </Card>

            <Card title="Dodaj komentarz" subtitle="Twój komentarz zostanie opublikowany po zatwierdzeniu przez moderatora">
                <AddCommentForm postId={id} />
            </Card>
        </>
    );
}

export default PostDetailPage;
