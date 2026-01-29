import { useState } from 'react';
import { SpaceRelationshipType } from '@/domain/space/types'; // Types allowed

interface RequestRelationshipParams {
    targetUserId: string;
    type: SpaceRelationshipType;
    message?: string;
}

export function useDomainSpace() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestRelationship = async (params: RequestRelationshipParams) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/domain/space/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send request');
            }
            return { success: true, data: data.data };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const acceptRelationship = async (relationshipId: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/domain/space/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relationshipId }),
            });
            if (!res.ok) {
                throw new Error('Failed to accept request');
            }
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        requestRelationship,
        acceptRelationship,
        loading,
        error
    };
}
