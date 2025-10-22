import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const { id } = params;

        const member = await prisma.members.findUnique({
            where: { id: id },
            include: {
                loans: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                author: true,
                            }
                        }
                    },
                    orderBy: {
                        loanDate: 'desc'
                    }
                }
            }
        });

        if (!member) {
            return Response.json({ 
                error: "Nie znaleziono członka" 
            }, { status: 404 });
        }

        const activeLoans = member.loans.filter(loan => loan.returnDate === null);
        const loanHistory = member.loans.filter(loan => loan.returnDate !== null);

        const response = {
            data: {
                id: member.id,
                name: member.name,
                email: member.email,
                createdAt: member.createdAt,
                activeLoans: activeLoans.map(loan => ({
                    id: loan.id,
                    book: loan.book,
                    loanDate: loan.loanDate,
                    dueDate: loan.dueDate,
                    isOverdue: new Date() > new Date(loan.dueDate)
                })),
                loanHistory: loanHistory.map(loan => ({
                    id: loan.id,
                    book: loan.book,
                    loanDate: loan.loanDate,
                    dueDate: loan.dueDate,
                    returnDate: loan.returnDate
                }))
            },
            status: 200
        };

    return Response.json(response);

    } catch (error) {
        console.error("Błąd podczas pobierania szczegółów członka:", error);
        return Response.json({ 
            error: "Błąd podczas pobierania szczegółów członka" 
        }, { status: 500 });
    }
}
