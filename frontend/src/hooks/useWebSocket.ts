import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useIncidentStore } from "../store/incidentStore";

const WS_BASE = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { user, token } = useAuthStore();
  const addIncident = useIncidentStore((s) => s.addIncident);

  useEffect(() => {
    if (!user || !token) return;

    const ws = new WebSocket(`${WS_BASE}/ws/${user.id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "incident") {
          addIncident(data.incident);
        }
      } catch {
        console.error("WS parse error");
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, [user, token]);

  const send = (data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { send };
}
