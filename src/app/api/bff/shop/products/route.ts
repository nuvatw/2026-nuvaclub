import { NextResponse } from 'next/server';
import { shopService } from '@/app/api/bff/composition';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as any;

    try {
        const products = category
            ? shopService.getProductsByCategory(category)
            : shopService.getAllShopProducts();

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
