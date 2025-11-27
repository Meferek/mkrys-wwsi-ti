import { prisma } from "@/lib/prisma";

// GET /api/lab3/comments/pending - Lista komentarzy oczekujących na moderację
export async function GET() {
    try {
        const pendingComments = await prisma.comments.findMany({
            where: {
                approved: 0
            },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ data: pendingComments, status: 200 });
    } catch (error) {
        console.error("Błąd podczas pobierania oczekujących komentarzy:", error);
        return Response.json({ error: "Błąd podczas pobierania oczekujących komentarzy" }, { status: 500 });
    }
}
