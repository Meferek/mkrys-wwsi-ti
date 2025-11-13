import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';

interface CartItem {
    product_id: string;
    qty: number;
}

async function getCart(): Promise<CartItem[]> {
    const cookieStore = await cookies();
    const cartData = cookieStore.get('cart');
    return cartData ? JSON.parse(cartData.value) : [];
}

async function clearCart() {
    const cookieStore = await cookies();
    cookieStore.delete('cart');
}

export async function POST() {
    try {
        const cart = await getCart();

        if (cart.length === 0) {
            return Response.json({ 
                error: "Koszyk jest pusty" 
            }, { status: 400 });
        }

        const productIds = cart.map(item => item.product_id);
        const products = await prisma.products.findMany({
            where: {
                id: { in: productIds }
            }
        });

        const order = await prisma.orders.create({
            data: {
                items: {
                    create: cart.map(item => {
                        const product = products.find(p => p.id === item.product_id);
                        if (!product) {
                            throw new Error(`Produkt ${item.product_id} nie został znaleziony`);
                        }
                        return {
                            productId: item.product_id,
                            qty: item.qty,
                            price: product.price
                        };
                    })
                }
            },
            include: {
                items: true
            }
        });

        const total = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        await clearCart();

        return Response.json({ 
            data: { order_id: order.id, total },
            message: "Zamówienie zostało złożone",
            status: 201 
        }, { status: 201 });
    } catch (error) {
        console.error("Błąd podczas składania zamówienia:", error);
        return Response.json({ 
            error: "Błąd podczas składania zamówienia" 
        }, { status: 500 });
    }
}
