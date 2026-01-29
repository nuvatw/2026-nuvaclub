import { NextResponse } from 'next/server';
import { getAllShopProducts, getShopProductById } from '@/Database';

// In real app, this would use a ProductRepository
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const product = getShopProductById(id);
        return product ? NextResponse.json(product) : NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const products = getAllShopProducts();
    return NextResponse.json(products);
}
