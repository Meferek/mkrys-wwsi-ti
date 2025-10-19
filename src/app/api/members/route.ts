import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const skip = page * pageSize;
        const totalCount = await prisma.members.count();

        const members = await prisma.members.findMany({
            skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                loans: {
                    select: {
                        id: true,
                        returnDate: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const membersWithStats = members.map(member => {
            const activeLoans = member.loans.filter(loan => loan.returnDate === null);
            
            return {
                id: member.id,
                name: member.name,
                email: member.email,
                createdAt: member.createdAt,
                activeLoans: activeLoans.length
            };
        });

        const response = {
            data: membersWithStats,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            status: 200
        };

        return Response.json(response);

    } catch (error) {
        console.error("Błąd podczas pobierania członków:", error);
        return Response.json({ error: "Błąd podczas pobierania członków" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return Response.json({ 
                error: "Pola 'name' i 'email' są wymagane" 
            }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({ 
                error: "Nieprawidłowy format adresu email" 
            }, { status: 400 });
        }

        const existingMember = await prisma.members.findUnique({
            where: { email }
        });

        if (existingMember) {
            return Response.json({ 
                error: "Członek z podanym adresem email już istnieje" 
            }, { status: 409 });
        }

        const newMember = await prisma.members.create({
            data: {
                name,
                email
            }
        });

        return Response.json({ 
            data: newMember,
            message: "Członek został dodany pomyślnie",
            status: 201 
        }, { status: 201 });

    } catch (error) {
        console.error("Błąd podczas dodawania członka:", error);
        return Response.json({ 
            error: "Błąd podczas dodawania członka" 
        }, { status: 500 });
    }
}
