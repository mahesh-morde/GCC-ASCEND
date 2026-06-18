// src/app/models/agent.model.ts
export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  health: number; // 0‑100
  status?: 'idle' | 'busy' | 'offline';
}
