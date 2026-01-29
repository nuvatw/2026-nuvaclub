import { useState, useEffect } from 'react';
import { MembershipInfo } from '@/domain/membership/types'; // Types allowed

export function useDomainMembership() {
    const [membership, setMembership] = useState<MembershipInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembership() {
            try {
                const res = await fetch('/api/domain/membership');
                if (res.ok) {
                    const data = await res.json();
                    setMembership(data);
                } else {
                    setMembership(null);
                }
            } catch (err) {
                setMembership(null);
            } finally {
                setLoading(false);
            }
        }
        fetchMembership();
    }, []);

    return { membership, loading };
}
