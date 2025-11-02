import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const book = await prisma.books.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                author: true,
                copies: true,
                loans: {
                    select: {
                        id: true,
                        returnDate: true
                    }
                }
            }
        });

        if (!book) {
            return Response.json({ 
                error: "Książka nie została znaleziona" 
            }, { status: 404 });
        }

        const activeLoans = book.loans.filter(loan => loan.returnDate === null);
        const activeLoansCount = activeLoans.length;
        const availableCopies = book.copies - activeLoansCount;
        const isAvailable = availableCopies > 0;

        return Response.json({
            data: {
                bookId: book.id,
                title: book.title,
                author: book.author,
                totalCopies: book.copies,
                activeLoans: activeLoansCount,
                availableCopies,
                isAvailable
            },
            status: 200
        });
    } catch (error) {
        console.error("Błąd podczas sprawdzania dostępności:", error);
        return Response.json({ 
            error: "Błąd podczas sprawdzania dostępności" 
        }, { status: 500 });
    }
}
