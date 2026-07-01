import { useEffect, useState } from "react";
import { Shield, Key, AlertTriangle, Activity } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useIncidentStore } from "../store/incidentStore";
import { useWebSocket } from "../hooks/useWebSocket";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const token = useAuthStore((s) => s.token);
  const incidents = useIncidentStore((s) => s.incidents);
  const [tokenCount, setTokenCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  useWebSocket();

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/tokens`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setTokenCount(data.length || 0))
      .catch(() => {});
    fetch(`${API}/api/incidents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setIncidentCount(data.length || 0))
      .catch(() => {});
  }, [token]);

  const severityColor = (s: string) => {
    switch (s) {
      case "critical": return "text-red-500 bg-red-900/30 border-red-800";
      case "high": return "text-orange-500 bg-orange-900/30 border-orange-800";
      case "medium": return "text-yellow-500 bg-yellow-900/30 border-yellow-800";
      default: return "text-green-500 bg-green-900/30 border-green-800";
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Honey Tokens</p>
              <p className="text-3xl font-bold text-white mt-1">{tokenCount}</p>
            </div>
            <Key className="w-10 h-10 text-cyan-400/50" />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Incidents</p>
              <p className="text-3xl font-bold text-white mt-1">{incidentCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-400/50" />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-3xl font-bold text-white mt-1">
                {incidents.filter((i) => i.severity === "critical" || i.severity === "high").length}
              </p>
            </div>
            <Activity className="w-10 h-10 text-yellow-400/50" />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Live Incidents</h2>
        {incidents.length === 0 ? (
          <p className="text-gray-500 text-sm">No incidents yet. Deploy honey tokens and trigger them to see activity.</p>
        ) : (
          <div className="space-y-3">
            {incidents.slice(0, 10).map((inc) => (
              <div
                key={inc.id}
                className="bg-gray-950 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{inc.token_name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${severityColor(inc.severity)}`}>
                    {inc.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{inc.report}</p>
                <p className="text-xs text-gray-600 mt-2">{new Date(inc.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
