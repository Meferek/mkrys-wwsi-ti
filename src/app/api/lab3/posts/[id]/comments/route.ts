import { prisma } from "@/lib/prisma";

// GET /api/lab3/posts/{id}/comments - Tylko zatwierdzone komentarze
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const comments = await prisma.comments.findMany({
            where: {
                postId: id,
                approved: 1
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ data: comments, status: 200 });
    } catch (error) {
        console.error("Błąd podczas pobierania komentarzy:", error);
        return Response.json({ error: "Błąd podczas pobierania komentarzy" }, { status: 500 });
    }
}

// POST /api/lab3/posts/{id}/comments - Dodawanie komentarza
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { author, body: commentBody } = body;

        if (!author || !commentBody) {
            return Response.json({ 
                error: "Pola 'author' i 'body' są wymagane" 
            }, { status: 400 });
        }

        // Sprawdź czy post istnieje
        const post = await prisma.posts.findUnique({
            where: { id }
        });

        if (!post) {
            return Response.json({ error: "Post nie został znaleziony" }, { status: 404 });
        }

        const newComment = await prisma.comments.create({
            data: {
                postId: id,
                author,
                body: commentBody,
                approved: 0 // Domyślnie niezatwierdzony
            }
        });

        return Response.json({ ...newComment, status: 201 }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas dodawania komentarza:", error);
        return Response.json({ error: "Błąd podczas dodawania komentarza" }, { status: 500 });
    }
}
