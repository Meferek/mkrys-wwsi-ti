import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const skip = page * pageSize;
        const totalCount = await prisma.books.count();

        const books = await prisma.books.findMany({
            skip,
            take: pageSize,
            select: {
                id: true,
                title: true,
                author: true,
                isbn: true,
                year: true,
                publisher: true,
                copies: true,
                createdAt: true,
                imageUrlL: true,
                loans: {
                    select: {
                        id: true,
                        returnDate: true
                    }
                }
            }
        });

        const booksWithAvailability = books.map(book => {
            const activeLoans = book.loans.filter(loan => loan.returnDate === null);
            const loanedCopies = activeLoans.length;
            const availableCopies = book.copies - loanedCopies;
            
            return {
                id: book.id,
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                year: book.year,
                publisher: book.publisher,
                copies: book.copies,
                loanedCopies,
                availableCopies,
                imageUrlL: book.imageUrlL,
                createdAt: book.createdAt
            };
        });
      
        const response = { 
            data: booksWithAvailability,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            status: 200 
        };

        return Response.json(response);
    } catch (error) {
        console.error("Błąd podczas pobierania książek:", error);
        return Response.json({ error: "Błąd podczas pobierania książek" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, author, copies, isbn, year, publisher } = body;

        if (!title || !author) {
            return Response.json({ 
                error: "Pole 'title' i 'author' są wymagane" 
            }, { status: 400 });
        }

        const copiesValue = copies ? parseInt(copies) : 1;
        if (copiesValue < 1) {
            return Response.json({ 
                error: "Liczba egzemplarzy musi być większa od 0" 
            }, { status: 400 });
        }

        if (isbn) {
            const existingBook = await prisma.books.findUnique({
                where: { isbn }
            });

            if (existingBook) {
                return Response.json({ 
                    error: "Książka z podanym ISBN już istnieje" 
                }, { status: 409 });
            }
        }

        const newBook = await prisma.books.create({
            data: {
                title,
                author,
                copies: copiesValue,
                isbn: isbn || null,
                year: year || null,
                publisher: publisher || null
            }
        });

        return Response.json({ 
            data: newBook,
            message: "Książka została dodana pomyślnie",
            status: 201 
        }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas dodawania książki:", error);
        return Response.json({ 
            error: "Błąd podczas dodawania książki" 
        }, { status: 500 });
    }
}
