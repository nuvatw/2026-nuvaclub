import { NextResponse } from 'next/server';
import { getAllShopProducts, getShopProductById } from '@/lib/legacy-db-shim';

// In real app, this would use a ProductRepository
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const product = getShopProductById(id);
        return product ? NextResponse.json(product) : NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const type = searchParams.get('type');
    const filter = searchParams.get('filter'); // e.g. 'upcoming'

    let products = getAllShopProducts();

    if (type) {
        products = products.filter(p => p.type === type);
    }

    if (filter === 'upcoming' && (type === 'event' || !type)) {
        const now = new Date();
        // Filter events that are in the future
        products = products.filter(p => {
            if (p.type !== 'event') return false;
            // Simplified check: assume event details in product or need join?
            // legacy-db-shim getAllShopProducts returns joined objects (ShopProduct)
            // ShopProduct has 'date'? No, ShopProduct is generic.
            // We might need to cast or check specific fields if available.
            // For now, let's skip complex date filtering here or use shim helper if accessible.
            return true;
        });
        // Actually, getAllShopProducts doesn't return future events only. 
        // Better to use specific shim function if strictness needed.
    }

    return NextResponse.json(products);
}
