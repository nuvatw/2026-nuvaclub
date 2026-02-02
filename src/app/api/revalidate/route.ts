
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATION_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const model = body.model;

        // Invalidate the universal 'cms' tag
        revalidateTag('cms');

        console.log(`[Revalidate] Cache cleared for tag 'cms' via webhook. Model: ${model}`);

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
