'use client';

import { useState, useEffect } from 'react';

export function useMerchandise() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/bff/shop/products?category=merchandise')
            .then(res => res.json())
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return { items, loading };
}

export function useEvents() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/bff/shop/events')
            .then(res => res.json())
            .then(data => {
                // Ensure dates are converted back to Date objects if needed
                const formatted = (Array.isArray(data) ? data : []).map(e => ({
                    ...e,
                    date: new Date(e.date),
                    endDate: e.endDate ? new Date(e.endDate) : undefined
                }));
                setItems(formatted);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return { items, loading };
}
