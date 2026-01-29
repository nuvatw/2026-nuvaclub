import { useState, useEffect } from 'react';
import { GateAction, GateResource, GateResponse } from '@/domain/gate/types'; // Importing TYPES is allowed

export function useDomainGate(resource: GateResource, action: GateAction, resourceId?: string) {
    const [response, setResponse] = useState<GateResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkGate() {
            try {
                const res = await fetch('/api/domain/gate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resource, action, resourceId }),
                });
                const data = await res.json();
                setResponse(data);
            } catch (err) {
                setResponse({ allowed: false, reason: 'FORBIDDEN', nextAction: 'none' });
            } finally {
                setLoading(false);
            }
        }
        checkGate();
    }, [resource, action, resourceId]);

    return {
        allowed: response?.allowed ?? false,
        reason: response?.reason,
        nextAction: response?.nextAction,
        loading
    };
}
