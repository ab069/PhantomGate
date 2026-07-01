import { create } from "zustand";

interface Incident {
  id: string;
  token_name: string;
  classification: string;
  severity: string;
  report: string;
  recommended_action: string;
  created_at: string;
}

interface IncidentState {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  setIncidents: (incidents: Incident[]) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  setIncidents: (incidents) => set({ incidents }),
}));
