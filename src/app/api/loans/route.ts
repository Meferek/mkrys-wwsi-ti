import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const active = url.searchParams.get('active') === 'true';
        const skip = page * pageSize;

        const allLoans = await prisma.loans.findMany({
            skip,
            take: pageSize,
            include: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            },
            orderBy: {
                loanDate: 'desc'
            }
        });

        const loans = active 
            ? allLoans.filter(loan => loan.returnDate === null)
            : allLoans;

        const allLoansForCount = await prisma.loans.findMany({
            select: { id: true, returnDate: true }
        });
        const totalCount = active
            ? allLoansForCount.filter(loan => loan.returnDate === null).length
            : allLoansForCount.length;

        const loansWithStatus = loans.map(loan => {
            const isActive = loan.returnDate === null;
            const isOverdue = isActive && new Date() > new Date(loan.dueDate);
            
            return {
                id: loan.id,
                member: loan.member,
                book: loan.book,
                memberName: loan.member.name,
                bookTitle: `${loan.book.title} (${loan.book.author})`,
                loanDate: loan.loanDate,
                loanDateFormatted: new Date(loan.loanDate).toLocaleDateString('pl-PL'),
                dueDate: loan.dueDate,
                dueDateFormatted: new Date(loan.dueDate).toLocaleDateString('pl-PL'),
                returnDate: loan.returnDate,
                returnDateFormatted: loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('pl-PL') : '-',
                isActive,
                isOverdue,
                statusLabel: isOverdue ? 'overdue' : (isActive ? 'active' : 'returned')
            };
        });

        const response = {
            data: loansWithStatus,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            status: 200
        };

        return Response.json(response);
    } catch (error) {
        console.error("Błąd podczas pobierania wypożyczeń:", error);
        return Response.json({ error: "Błąd podczas pobierania wypożyczeń" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { memberId, bookId, loanDate, dueDate } = body;

        if (!memberId || !bookId) {
            return Response.json({ 
                error: "Pola 'memberId' i 'bookId' są wymagane" 
            }, { status: 400 });
        }

        const member = await prisma.members.findUnique({
            where: { id: memberId }
        });

        if (!member) {
            return Response.json({ 
                error: "Nie znaleziono członka" 
            }, { status: 404 });
        }

        const bookExists = await prisma.books.findUnique({
            where: { id: bookId },
            select: {
                id: true,
                title: true,
                copies: true,
                loans: {
                    select: {
                        id: true,
                        returnDate: true
                    }
                }
            }
        });

        if (!bookExists) {
            return Response.json({ 
                error: "Nie znaleziono książki" 
            }, { status: 404 });
        }

        const activeLoans = bookExists.loans.filter(loan => loan.returnDate === null);
        const activeLoansCount = activeLoans.length;

        if (activeLoansCount >= bookExists.copies) {
            return Response.json({ 
                error: `Brak dostępnych egzemplarzy. Wszystkie ${bookExists.copies} egzemplarze książki "${bookExists.title}" są już wypożyczone.`,
                details: {
                    bookTitle: bookExists.title,
                    totalCopies: bookExists.copies,
                    activeLoans: activeLoansCount,
                    availableCopies: 0
                }
            }, { status: 409 });
        }

        const loanDateValue = loanDate ? new Date(loanDate) : new Date();
        const dueDateValue = dueDate 
            ? new Date(dueDate) 
            : new Date(loanDateValue.getTime() + 14 * 24 * 60 * 60 * 1000);

        const newLoan = await prisma.loans.create({
            data: {
                memberId,
                bookId,
                loanDate: loanDateValue,
                dueDate: dueDateValue
            },
            include: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            }
        });

        return Response.json({ 
            data: newLoan,
            message: "Książka została wypożyczona pomyślnie",
            status: 201 
        }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas wypożyczania książki:", error);
        return Response.json({ 
            error: "Błąd podczas wypożyczania książki" 
        }, { status: 500 });
    }
}
