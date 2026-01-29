import { useState, useEffect, useMemo } from 'react';

// Simplified types for search results
export interface SearchItem {
    id: string;
    title: string;
    type: 'course' | 'product' | 'project';
    url: string;
    tags?: string[];
    description?: string;
    // Extra fields that might be used by UI filters, 
    // ideally these should be normalized or UI should adapt.
    // For now we simulate the structure HeaderSearch expects
}

interface SearchData {
    courses: any[];
    products: any[];
    projects: any[];
}

export function useGlobalSearch() {
    const [data, setData] = useState<SearchData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/bff/search');
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (err) {
                console.error("Search fetch failed", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Helpers to match old API for smooth migration
    const getAllCourses = useMemo(() => () => data?.courses || [], [data]);
    const getAllShopProducts = useMemo(() => () => data?.products || [], [data]);
    const getProjectsWithSeasonInfo = useMemo(() => () => data?.projects || [], [data]);

    return {
        getAllCourses,
        getAllShopProducts,
        getProjectsWithSeasonInfo,
        loading
    };
}
