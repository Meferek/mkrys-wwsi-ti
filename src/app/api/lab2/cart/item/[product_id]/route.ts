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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ product_id: string }> }
) {
    try {
        const { product_id } = await params;
        const cart = await getCart();
        const filteredCart = cart.filter(item => item.product_id !== product_id);

        if (filteredCart.length === cart.length) {
            return Response.json({ 
                error: "Produkt nie znajduje się w koszyku" 
            }, { status: 404 });
        }

        await saveCart(filteredCart);

        return Response.json({ 
            data: filteredCart,
            message: "Produkt usunięty z koszyka",
            status: 200 
        });
    } catch (error) {
        console.error("Błąd podczas usuwania z koszyka:", error);
        return Response.json({ 
            error: "Błąd podczas usuwania z koszyka" 
        }, { status: 500 });
    }
}
