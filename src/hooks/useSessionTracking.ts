import { useEffect, useRef } from 'react';
import { pulseApi } from '@/lib/pulse';

interface UseSessionTrackingOptions {
    pagePath: string;
    labId?: string;
    enabled?: boolean;
}

/**
 * Hook to automatically track user sessions
 * - Starts session on mount
 * - Sends heartbeat every 30 seconds
 * - Ends session on unmount
 */
export const useSessionTracking = ({
    pagePath,
    labId,
    enabled = true
}: UseSessionTrackingOptions) => {
    const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Start tracking
        const startTracking = async () => {
            const sessionId = await pulseApi.trackPageView(pagePath, labId);
            sessionIdRef.current = sessionId;

            // Setup heartbeat (every 30 seconds)
            heartbeatInterval.current = setInterval(() => {
                pulseApi.heartbeat();
            }, 30000); // 30 seconds
        };

        startTracking();

        // Cleanup on unmount
        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
            pulseApi.endSession();
        };
    }, [pagePath, labId, enabled]);

    return { sessionId: sessionIdRef.current };
};
