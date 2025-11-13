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

async function saveCart(cart: CartItem[]) {
    const cookieStore = await cookies();
    cookieStore.set('cart', JSON.stringify(cart), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    });
}

export async function GET() {
    try {
        const cart = await getCart();
        return Response.json({ data: cart, status: 200 });
    } catch (error) {
        console.error("Błąd podczas pobierania koszyka:", error);
        return Response.json({ error: "Błąd podczas pobierania koszyka" }, { status: 500 });
    }
}
