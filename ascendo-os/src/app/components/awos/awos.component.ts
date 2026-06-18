import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationService } from '../../services/simulation.service';
import { SecurityService } from '../../services/security.service';
import { Task } from '../../models/task.model';
import { Agent } from '../../models/agent.model';

@Component({
  selector: 'app-awos',
  templateUrl: './awos.component.html',
  styleUrls: ['./awos.component.css']
})
export class AwosComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  agents: Agent[] = [];
  taskLogs: { [taskId: string]: string[] } = {};
  selectedTaskId: string | null = null;
  activeDeckTab: 'telemetry' | 'dispatch' | 'console' = 'telemetry';

  // New task form fields
  newTaskTitle = '';
  newTaskRisk: 'low' | 'medium' | 'high' = 'low';
  newTaskAgent = 'finance-agent';

  // Stats summaries
  stats = { queued: 0, progress: 0, approval: 0, completed: 0 };

  // Interactive ping console states
  pingTimes: { [agentId: string]: { value: string; pinging: boolean } } = {};

  private sub = new Subscription();

  constructor(
    private simulationService: SimulationService,
    private securityService: SecurityService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.simulationService.tasks$.subscribe(tasks => {
        this.tasks = tasks;
        this.updateStats();

        // If no task is selected, select the first in-progress or awaiting-approval one
        if (!this.selectedTaskId && tasks.length > 0) {
          const activeTask = tasks.find(t => t.status === 'in-progress' || t.status === 'awaiting-approval');
          if (activeTask) {
            this.selectedTaskId = activeTask.id;
          } else {
            this.selectedTaskId = tasks[tasks.length - 1].id;
          }
        }
      })
    );

    this.sub.add(
      this.simulationService.agents$.subscribe(agents => {
        this.agents = agents;
      })
    );

    this.sub.add(
      this.simulationService.taskLogs$.subscribe(logs => {
        this.taskLogs = logs;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private updateStats() {
    this.stats = {
      queued: this.tasks.filter(t => t.status === 'queued').length,
      progress: this.tasks.filter(t => t.status === 'in-progress').length,
      approval: this.tasks.filter(t => t.status === 'awaiting-approval').length,
      completed: this.tasks.filter(t => t.status === 'completed').length
    };
  }

  selectTask(taskId: string) {
    this.selectedTaskId = taskId;
    this.activeDeckTab = 'console';
  }

  getAgentName(agentId?: string): string {
    if (!agentId) return 'Unassigned';
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? agent.name : agentId;
  }

  getAgentStatus(agentId?: string): 'idle' | 'busy' | 'offline' {
    if (!agentId) return 'offline';
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? (agent.status || 'idle') : 'offline';
  }

  isAgentQuarantined(agentId?: string): boolean {
    if (!agentId) return false;
    return this.securityService.isAgentQuarantined(agentId);
  }

  createTask() {
    if (!this.newTaskTitle.trim()) return;
    this.simulationService.addTask(this.newTaskTitle, this.newTaskRisk, this.newTaskAgent);
    this.newTaskTitle = '';
    // Auto-select latest task and show logs tab
    setTimeout(() => {
      const pendingTasks = this.tasks.filter(t => t.status !== 'completed');
      if (pendingTasks.length > 0) {
        this.selectedTaskId = pendingTasks[pendingTasks.length - 1].id;
      }
      this.activeDeckTab = 'console';
    }, 100);
  }

  approveTask(taskId: string, event: Event) {
    event.stopPropagation(); // prevent selectTask
    this.simulationService.approveTask(taskId);
  }

  rejectTask(taskId: string, event: Event) {
    event.stopPropagation(); // prevent selectTask
    this.simulationService.rejectTask(taskId);
  }

  getLogsForSelected(): string[] {
    if (!this.selectedTaskId) return [];
    return this.taskLogs[this.selectedTaskId] || ['Initializing...'];
  }

  getSelectedTask(): Task | undefined {
    return this.tasks.find(t => t.id === this.selectedTaskId);
  }

  pingAgent(agentId: string) {
    if (this.isAgentQuarantined(agentId)) {
      this.pingTimes[agentId] = { value: 'BLOCKED', pinging: true };
      setTimeout(() => {
        this.pingTimes[agentId] = { value: 'MUTED (OFFLINE)', pinging: false };
      }, 700);
      return;
    }

    this.pingTimes[agentId] = { value: '', pinging: true };
    setTimeout(() => {
      const ms = Math.floor(12 + Math.random() * 30);
      this.pingTimes[agentId] = { value: `${ms}ms`, pinging: false };
    }, 500);
  }
}
