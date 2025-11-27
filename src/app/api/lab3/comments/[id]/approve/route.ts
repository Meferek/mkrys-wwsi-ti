import { prisma } from "@/lib/prisma";

// POST /api/lab3/comments/{id}/approve - Zatwierdzanie komentarza
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const comment = await prisma.comments.findUnique({
            where: { id }
        });

        if (!comment) {
            return Response.json({ error: "Komentarz nie został znaleziony" }, { status: 404 });
        }

        const updatedComment = await prisma.comments.update({
            where: { id },
            data: {
                approved: 1
            }
        });

        return Response.json(updatedComment, { status: 200 });
    } catch (error) {
        console.error("Błąd podczas zatwierdzania komentarza:", error);
        return Response.json({ error: "Błąd podczas zatwierdzania komentarza" }, { status: 500 });
    }
}
