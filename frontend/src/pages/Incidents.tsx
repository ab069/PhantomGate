import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useIncidentStore } from "../store/incidentStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Incidents() {
  const token = useAuthStore((s) => s.token);
  const { incidents, setIncidents } = useIncidentStore();

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/incidents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setIncidents(data);
      })
      .catch(() => {});
  }, [token]);

  const severityColor = (s: string) => {
    switch (s) {
      case "critical": return "bg-red-900/30 text-red-400 border-red-800";
      case "high": return "bg-orange-900/30 text-orange-400 border-orange-800";
      case "medium": return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
      case "low": return "bg-green-900/30 text-green-400 border-green-800";
      default: return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Incidents</h1>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
            No incidents recorded. Trigger a honey token to generate an incident.
          </div>
        ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{inc.token_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${severityColor(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                      {inc.classification}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(inc.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-3">
                <p className="text-sm text-gray-300">{inc.report}</p>
              </div>
              {inc.recommended_action && (
                <div className="border-l-4 border-cyan-700 bg-cyan-950/30 pl-4 py-2 rounded">
                  <p className="text-xs text-cyan-400 font-medium mb-0.5">Recommended Action</p>
                  <p className="text-sm text-gray-300">{inc.recommended_action}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
