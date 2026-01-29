import { useState, useEffect } from 'react';
import type { MembershipSummaryDTO } from '@/application/dtos/MembershipSummaryDTO';

export function useBffMembership() {
    const [summary, setSummary] = useState<MembershipSummaryDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const res = await fetch('/api/bff/membership/summary');
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);
                } else {
                    setSummary(null);
                }
            } catch (err) {
                setSummary(null);
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);

    return { summary, loading };
}
