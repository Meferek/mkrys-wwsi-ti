import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { returnDate } = body;

        const loan = await prisma.loans.findUnique({
            where: { id },
            include: {
                member: {
                    select: {
                        name: true
                    }
                },
                book: {
                    select: {
                        title: true
                    }
                }
            }
        });

        if (!loan) {
            return Response.json({ 
                error: "Nie znaleziono wypożyczenia" 
            }, { status: 404 });
        }

        if (loan.returnDate !== null) {
            return Response.json({ 
                error: "Ta książka została już zwrócona" 
            }, { status: 400 });
        }

        const returnDateValue = returnDate ? new Date(returnDate) : new Date();

        const updatedLoan = await prisma.loans.update({
            where: { id },
            data: {
                returnDate: returnDateValue
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
            data: updatedLoan,
            message: "Książka została zwrócona pomyślnie",
            status: 200 
        });
    } catch (error) {
        console.error("Błąd podczas zwrotu książki:", error);
        return Response.json({ 
            error: "Błąd podczas zwrotu książki" 
        }, { status: 500 });
    }
}
