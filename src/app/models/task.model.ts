// src/app/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  risk: 'low' | 'medium' | 'high';
  status: 'queued' | 'in-progress' | 'awaiting-approval' | 'completed';
  assignedAgent?: string;
}
