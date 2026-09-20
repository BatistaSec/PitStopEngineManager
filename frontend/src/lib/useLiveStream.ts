'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from './api';

interface UseLiveStreamOptions<T> {
  /** SSE endpoint path (e.g. '/telemetry/stream') */
  endpoint: string;
  /** SSE event name to listen for (e.g. 'telemetry', 'livetiming') */
  eventName: string;
  /** Fallback polling interval in ms if SSE fails (default 3000) */
  pollingFallbackMs?: number;
  /** Whether the hook is enabled */
  enabled?: boolean;
}

export const STREAMER_BASE_URL = process.env.NEXT_PUBLIC_STREAMER_URL || 'http://localhost:3001/api/v1';

export function useLiveStream<T>({
  endpoint,
  eventName,
  pollingFallbackMs = 3000,
  enabled = true,
}: UseLiveStreamOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Clean up previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const url = `${STREAMER_BASE_URL}${endpoint}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener(eventName, (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data) as T;
          setData(parsed);
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
        } catch (parseError) {
          console.warn('[SSE] Failed to parse event data:', parseError);
        }
      });

      es.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        eventSourceRef.current = null;

        // Exponential backoff reconnect (max 10s)
        const delay = Math.min(
          pollingFallbackMs * Math.pow(1.5, reconnectAttemptsRef.current),
          10000
        );
        reconnectAttemptsRef.current++;

        setError(`SSE desconectado. Reconectando em ${Math.round(delay / 1000)}s...`);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (err) {
      setError('Falha ao conectar ao stream SSE');
      setIsConnected(false);
    }
  }, [enabled, endpoint, eventName, pollingFallbackMs]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return { data, isConnected, error, reconnect: connect, disconnect };
}
