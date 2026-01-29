import { useState, useEffect, useCallback } from 'react';
import { ShopProduct } from '@/lib/types/legacy-shim';

export function useShopCatalog() {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/bff/shop/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (err) {
                console.error("Failed to fetch shop catalog", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const getProductById = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    return { products, getProductById, loading };
}
