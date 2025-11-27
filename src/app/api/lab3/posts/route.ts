import { prisma } from "@/lib/prisma";

// GET /api/lab3/posts - Lista wszystkich postów
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const skip = page * pageSize;
        const totalCount = await prisma.posts.count();

        const posts = await prisma.posts.findMany({
            skip,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                body: true,
                createdAt: true,
                _count: {
                    select: {
                        comments: {
                            where: {
                                approved: 1
                            }
                        }
                    }
                }
            }
        });

        const response = { 
            data: posts,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            status: 200 
        };

        return Response.json(response);
    } catch (error) {
        console.error("Błąd podczas pobierania postów:", error);
        return Response.json({ error: "Błąd podczas pobierania postów" }, { status: 500 });
    }
}

// POST /api/lab3/posts - Dodawanie nowego posta
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, body: postBody } = body;

        if (!title || !postBody) {
            return Response.json({ 
                error: "Pola 'title' i 'body' są wymagane" 
            }, { status: 400 });
        }

        const newPost = await prisma.posts.create({
            data: {
                title,
                body: postBody
            }
        });

        return Response.json({ ...newPost, status: 201 }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas dodawania posta:", error);
        return Response.json({ error: "Błąd podczas dodawania posta" }, { status: 500 });
    }
}
