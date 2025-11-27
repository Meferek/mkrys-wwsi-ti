import { prisma } from "@/lib/prisma";

// GET /api/lab3/posts/{id} - Szczegóły pojedynczego posta
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
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
            return Response.json({ error: "Post nie został znaleziony" }, { status: 404 });
        }

        return Response.json(post);
    } catch (error) {
        console.error("Błąd podczas pobierania posta:", error);
        return Response.json({ error: "Błąd podczas pobierania posta" }, { status: 500 });
    }
}
