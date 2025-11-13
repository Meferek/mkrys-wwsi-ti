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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product_id, qty } = body;

        if (!product_id || !qty || qty <= 0) {
            return Response.json({ 
                error: "Pole 'product_id' i 'qty' (>0) są wymagane" 
            }, { status: 400 });
        }

        const cart = await getCart();
        const existingItem = cart.find(item => item.product_id === product_id);

        if (existingItem) {
            existingItem.qty += parseInt(qty);
        } else {
            cart.push({ product_id, qty: parseInt(qty) });
        }

        await saveCart(cart);

        return Response.json({ 
            data: cart,
            message: "Produkt dodany do koszyka",
            status: 200 
        });
    } catch (error) {
        console.error("Błąd podczas dodawania do koszyka:", error);
        return Response.json({ 
            error: "Błąd podczas dodawania do koszyka" 
        }, { status: 500 });
    }
}
