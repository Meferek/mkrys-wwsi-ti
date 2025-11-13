import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const skip = page * pageSize;
        const totalCount = await prisma.products.count();

        const products = await prisma.products.findMany({
            skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                price: true,
                createdAt: true
            }
        });

        const response = { 
            data: products,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            status: 200 
        };

        return Response.json(response);
    } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
        return Response.json({ error: "Błąd podczas pobierania produktów" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price } = body;

        if (!name || price === undefined || price === null) {
            return Response.json({ 
                error: "Pole 'name' i 'price' są wymagane" 
            }, { status: 400 });
        }

        const priceValue = parseFloat(price);
        if (priceValue < 0) {
            return Response.json({ 
                error: "Cena musi być większa lub równa 0" 
            }, { status: 400 });
        }

        const newProduct = await prisma.products.create({
            data: {
                name,
                price: priceValue
            }
        });

        return Response.json({ 
            data: newProduct,
            message: "Produkt został dodany pomyślnie",
            status: 201 
        }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas dodawania produktu:", error);
        return Response.json({ 
            error: "Błąd podczas dodawania produktu" 
        }, { status: 500 });
    }
}
