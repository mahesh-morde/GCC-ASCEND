import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { Agent } from '../models/agent.model';
import { Policy } from '../models/policy.model';
import { SecurityService } from './security.service';

export interface Handshake {
  id: string;
  taskId: string;
  taskTitle: string;
  initiatorId: string;
  initiatorName: string;
  targetId: string;
  targetName: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
  requiredSignatures: string[];
  grantedSignatures: { agentId: string; signature: string; timestamp: Date }[];
  details: string;
  humanDelegatorId: string;
  humanDelegatorName: string;
  zkpProofToken: string;
  zkpVerificationStatus: 'verified' | 'failed';
}

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private agentsSubject = new BehaviorSubject<Agent[]>([]);
  agents$ = this.agentsSubject.asObservable();

  private policiesSubject = new BehaviorSubject<Policy[]>([]);
  policies$ = this.policiesSubject.asObservable();

  private handshakesSubject = new BehaviorSubject<Handshake[]>([]);
  handshakes$ = this.handshakesSubject.asObservable();

  private taskLogsSubject = new BehaviorSubject<{ [taskId: string]: string[] }>({});
  taskLogs$ = this.taskLogsSubject.asObservable();

  private simulationSpeedSubject = new BehaviorSubject<number>(1); // 0 = paused, 1 = 1x, 2 = 2x
  simulationSpeed$ = this.simulationSpeedSubject.asObservable();

  private initialAgents: Agent[] = [
    { id: 'finance-agent', name: 'Finance Agent (FinPulse)', capabilities: ['Disbursements', 'Budget Audit', 'Escrow Management'], health: 100, status: 'idle' },
    { id: 'hr-agent', name: 'HR Agent (TalentFlow)', capabilities: ['Relocation Processing', 'Payroll Audits', 'Benefits Provisioning'], health: 100, status: 'idle' },
    { id: 'it-agent', name: 'IT Provisioner (SysGuard)', capabilities: ['Access Control', 'SSH Rotation', 'Resource Allocations'], health: 100, status: 'idle' },
    { id: 'security-agent', name: 'Security Agent (Sentinel Node)', capabilities: ['Consensus Witness', 'Threat Quarantine', 'System Lockdown'], health: 100, status: 'idle' }
  ];

  private initialPolicies: Policy[] = [
    { id: 'pol-1', name: 'Dual-Agent Consensus Policy', description: 'Requires at least 2 validator agent signatures for medium-risk tasks.', requiredSignatures: 2 },
    { id: 'pol-2', name: 'High-Value Financial Disbursement', description: 'Requires HITL approval and 3 validator signatures for high-risk operations.', requiredSignatures: 3 },
    { id: 'pol-3', name: 'Standard IT Provisioning', description: 'Requires 1 signature witness for low-risk actions.', requiredSignatures: 1 }
  ];

  private mockTaskTemplates = [
    { title: 'Emergency Relocation Reimbursement', risk: 'high' as const, agentId: 'hr-agent' },
    { title: 'Rotate Database Root Credentials', risk: 'high' as const, agentId: 'it-agent' },
    { title: 'Disburse Q3 Vendor Payments', risk: 'medium' as const, agentId: 'finance-agent' },
    { title: 'Provision Sandbox DB Workspace', risk: 'low' as const, agentId: 'it-agent' },
    { title: 'Process Standard Monthly Payroll', risk: 'medium' as const, agentId: 'hr-agent' },
    { title: 'Re-audit Expense Claims (IT Hardware)', risk: 'low' as const, agentId: 'finance-agent' }
  ];

  constructor(private securityService: SecurityService) {
    this.agentsSubject.next(this.initialAgents);
    this.policiesSubject.next(this.initialPolicies);
    this.initializeDefaultTasks();

    // Start simulation loop driven dynamically by speedSubject
    this.simulationSpeedSubject.pipe(
      switchMap(speed => {
        if (speed === 0) {
          return NEVER;
        }
        const delay = 4000 / speed;
        return interval(delay);
      })
    ).subscribe(() => {
      this.runSimulationStep();
    });

    // Watch quarantine updates to sync agent health & status
    this.securityService.quarantinedAgents$.subscribe(quarantined => {
      const currentAgents = this.agentsSubject.value.map(a => {
        if (quarantined.has(a.id)) {
          return { ...a, health: 10, status: 'offline' as const };
        } else {
          return { ...a, health: 100, status: a.status === 'offline' ? 'idle' : a.status };
        }
      });
      this.agentsSubject.next(currentAgents);
    });
  }

  private initializeDefaultTasks() {
    const tasks: Task[] = [
      { id: 'task-101', title: 'Onboard Senior Director (Finance)', risk: 'medium', status: 'completed', assignedAgent: 'hr-agent' },
      { id: 'task-102', title: 'Audit Global AWS Instance Billing', risk: 'low', status: 'completed', assignedAgent: 'finance-agent' },
      { id: 'task-103', title: 'Emergency Relocation Funds ($50k)', risk: 'high', status: 'awaiting-approval', assignedAgent: 'hr-agent' },
      { id: 'task-104', title: 'Rotate API Keys for Payment Gateway', risk: 'high', status: 'in-progress', assignedAgent: 'finance-agent' }
    ];

    this.tasksSubject.next(tasks);

    // Seed task logs
    const initialLogs: { [taskId: string]: string[] } = {
      'task-101': [
        'Task created.',
        'Assigned to TalentFlow (HR Agent).',
        'Handshake requested with ITAgent for profile creation.',
        'Proof-of-Authority (PoA) signatures obtained.',
        'Task completed successfully.'
      ],
      'task-102': [
        'Task created.',
        'Assigned to FinPulse (Finance Agent).',
        'Scanning AWS cost reports.',
        'Discrepancies: None.',
        'Task completed.'
      ],
      'task-103': [
        'Task created.',
        'Assigned to TalentFlow (HR Agent).',
        'Risk audit: High. Requires Human-in-the-Loop (HITL) approval.',
        'Awaiting human verification...'
      ],
      'task-104': [
        'Task created.',
        'Assigned to FinPulse (Finance Agent).',
        'Initiating rotation protocol.',
        'Verifying key permissions.'
      ]
    };
    this.taskLogsSubject.next(initialLogs);
  }

  private runSimulationStep() {
    const tasks = [...this.tasksSubject.value];
    let logsChanged = false;
    const currentLogs = { ...this.taskLogsSubject.value };
    let tasksChanged = false;

    // 1. Process active tasks
    tasks.forEach((task, index) => {
      if (task.status === 'in-progress') {
        const agentId = task.assignedAgent;
        if (!agentId) return;

        // If the assigned agent is quarantined, block task progress
        if (this.securityService.isAgentQuarantined(agentId)) {
          const logMsg = `[BLOCKED] Task execution suspended. Agent is quarantined due to active security threat.`;
          if (!currentLogs[task.id].includes(logMsg)) {
            currentLogs[task.id] = [...currentLogs[task.id], logMsg];
            logsChanged = true;
          }
          return;
        }

        // Advance progress
        const logSteps = currentLogs[task.id] || [];
        if (logSteps.length < 5) {
          // Add steps
          const stepIndex = logSteps.length;
          let newStepText = '';
          if (stepIndex === 2) {
            newStepText = `[AGL] Policy Check: Traced delegation to human leader. Privilege escalation audit: Initiator does not exceed authority limits. Passed.`;
          } else if (stepIndex === 3) {
            if (task.risk === 'high') {
              tasks[index] = { ...task, status: 'awaiting-approval' };
              tasksChanged = true;
              newStepText = `[Sentinel] Threat check clear. [AGL] Zero-Knowledge Proof (ZKP) threshold validation compiled. Risk is HIGH: routed to Human-In-The-Loop (HITL) Desk.`;
            } else {
              newStepText = `[AGL] Consensus requested. Gathering Verifiable Credentials (VCs) and witness signatures from peer nodes...`;
            }
          } else if (stepIndex === 4) {
            // Low / Medium risks execute handshake directly
            this.executeHandshake(task);
            tasks[index] = { ...task, status: 'completed' };
            tasksChanged = true;
            newStepText = `[AGL] Handshake consensus verified. ZKP cryptographic proof committed to decentralized ledger. Operation completed successfully.`;
          }
          
          if (newStepText) {
            currentLogs[task.id] = [...logSteps, newStepText];
            logsChanged = true;
          }
        }
      }
    });

    // 2. Randomly spawn a new task if below capacity
    const activeTasks = tasks.filter(t => t.status === 'in-progress' || t.status === 'queued' || t.status === 'awaiting-approval');
    if (activeTasks.length < 5 && Math.random() < 0.4) {
      const template = this.mockTaskTemplates[Math.floor(Math.random() * this.mockTaskTemplates.length)];
      const newTaskId = `task-${Math.floor(100 + Math.random() * 900)}`;
      const newTask: Task = {
        id: newTaskId,
        title: template.title,
        risk: template.risk,
        status: 'queued',
        assignedAgent: template.agentId
      };

      tasks.push(newTask);
      tasksChanged = true;

      currentLogs[newTaskId] = [
        `Task created.`,
        `Risk tier evaluated: ${template.risk.toUpperCase()}.`,
        `Assigned to Agent: ${template.agentId}`
      ];
      logsChanged = true;

      // Automatically change queued to in-progress in next check, or do it now:
      setTimeout(() => {
        this.startTask(newTaskId);
      }, 500);
    }

    if (tasksChanged) {
      this.tasksSubject.next(tasks);
    }
    if (logsChanged) {
      this.taskLogsSubject.next(currentLogs);
    }

    // Update agent statuses
    this.updateAgentStatusField();
  }

  private updateAgentStatusField() {
    const tasks = this.tasksSubject.value;
    const currentAgents = [...this.agentsSubject.value];
    let changed = false;

    currentAgents.forEach((agent, idx) => {
      if (agent.status === 'offline') return;

      const isBusy = tasks.some(t => t.assignedAgent === agent.id && (t.status === 'in-progress' || t.status === 'awaiting-approval'));
      const newStatus = isBusy ? 'busy' as const : 'idle' as const;

      if (agent.status !== newStatus) {
        currentAgents[idx] = { ...agent, status: newStatus };
        changed = true;
      }
    });

    if (changed) {
      this.agentsSubject.next(currentAgents);
    }
  }

  private startTask(taskId: string) {
    const tasks = [...this.tasksSubject.value];
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1 && tasks[index].status === 'queued') {
      tasks[index] = { ...tasks[index], status: 'in-progress' };
      this.tasksSubject.next(tasks);
      this.updateAgentStatusField();
    }
  }

  approveTask(taskId: string) {
    const tasks = [...this.tasksSubject.value];
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1 && tasks[index].status === 'awaiting-approval') {
      const task = tasks[index];

      // Add approval log
      const currentLogs = { ...this.taskLogsSubject.value };
      currentLogs[task.id] = [
        ...(currentLogs[task.id] || []),
        `HITL Approval GRANTED by administrator.`,
        `Initiating Proof-of-Authority handshakes...`
      ];
      this.taskLogsSubject.next(currentLogs);

      // Execute handshake
      this.executeHandshake(task);

      // Mark completed
      tasks[index] = { ...task, status: 'completed' };
      this.tasksSubject.next(tasks);

      // Update log with final status
      setTimeout(() => {
        const logs = { ...this.taskLogsSubject.value };
        logs[task.id] = [
          ...(logs[task.id] || []),
          `Consensus handshakes verified. Cryptographic proof committed. Task Completed.`
        ];
        this.taskLogsSubject.next(logs);
      }, 500);

      this.updateAgentStatusField();
    }
  }

  rejectTask(taskId: string) {
    const tasks = [...this.tasksSubject.value];
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1 && tasks[index].status === 'awaiting-approval') {
      const task = tasks[index];

      // Add rejection log
      const currentLogs = { ...this.taskLogsSubject.value };
      currentLogs[task.id] = [
        ...(currentLogs[task.id] || []),
        `HITL Approval REJECTED by administrator. Task cancelled. Security report filed.`
      ];
      this.taskLogsSubject.next(currentLogs);

      // Mark completed (or write canceled - let's set as completed but with failure state)
      // For simplicity in UI, we remove or mark completed
      tasks[index] = { ...task, status: 'completed' };
      this.tasksSubject.next(tasks);
      this.updateAgentStatusField();
    }
  }

  private executeHandshake(task: Task) {
    const initiatorId = task.assignedAgent || 'finance-agent';
    const initiator = this.agentsSubject.value.find(a => a.id === initiatorId);
    const initiatorName = initiator ? initiator.name : 'Unknown Agent';

    // Select target agent based on task type
    let targetId = 'security-agent';
    if (initiatorId === 'hr-agent') {
      targetId = 'finance-agent';
    } else if (initiatorId === 'finance-agent') {
      targetId = 'security-agent';
    } else if (initiatorId === 'it-agent') {
      targetId = 'security-agent';
    }

    const target = this.agentsSubject.value.find(a => a.id === targetId);
    const targetName = target ? target.name : 'Security Validator';

    // Verify if either agent is quarantined
    const initiatorQuarantined = this.securityService.isAgentQuarantined(initiatorId);
    const targetQuarantined = this.securityService.isAgentQuarantined(targetId);

    const isSuccess = !initiatorQuarantined && !targetQuarantined;

    // Determine signatures required based on risk
    const signers = ['security-agent'];
    if (task.risk === 'high') {
      signers.push('finance-agent', 'hr-agent');
    } else if (task.risk === 'medium') {
      signers.push(initiatorId === 'hr-agent' ? 'finance-agent' : 'hr-agent');
    }

    // Generate signatures list
    const grantedSignatures = signers.map(s => {
      const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
      return {
        agentId: s,
        signature: `SIG_POA_${s.toUpperCase().replace('-', '_')}_${randHex}`,
        timestamp: new Date()
      };
    });

    const delegators = [
      { id: 'AD-101', name: 'AD-101 (VP of HR)' },
      { id: 'AD-202', name: 'AD-202 (CFO)' },
      { id: 'AD-303', name: 'AD-303 (VP of IT)' }
    ];
    let delegator = delegators[0];
    if (initiatorId === 'finance-agent') {
      delegator = delegators[1];
    } else if (initiatorId === 'it-agent') {
      delegator = delegators[2];
    }

    const randZkp = 'ZKP_PROOF_' + Math.random().toString(16).substring(2, 12).toUpperCase();

    const newHandshake: Handshake = {
      id: `hs-${Math.random().toString(36).substring(2, 9)}`,
      taskId: task.id,
      taskTitle: task.title,
      initiatorId,
      initiatorName,
      targetId,
      targetName,
      timestamp: new Date(),
      status: isSuccess ? 'success' : 'failed',
      requiredSignatures: signers,
      grantedSignatures: isSuccess ? grantedSignatures : [],
      details: isSuccess
        ? `Consensus reached. Authenticated via PoA VCs. ZKP verified satisfying policy guardrails. Signatures collected: [${signers.join(', ')}].`
        : `Handshake FAILED. Crucial validator agent '${initiatorQuarantined ? initiatorName : targetName}' is isolated (Quarantined).`,
      humanDelegatorId: delegator.id,
      humanDelegatorName: delegator.name,
      zkpProofToken: isSuccess ? randZkp : '0x000000000000000000000000',
      zkpVerificationStatus: isSuccess ? 'verified' : 'failed'
    };

    const currentHandshakes = this.handshakesSubject.value;
    this.handshakesSubject.next([newHandshake, ...currentHandshakes].slice(0, 30));
  }

  addTask(title: string, risk: 'low' | 'medium' | 'high', agentId: string) {
    const newTaskId = `task-${Math.floor(100 + Math.random() * 900)}`;
    const newTask: Task = {
      id: newTaskId,
      title,
      risk,
      status: 'queued',
      assignedAgent: agentId
    };

    const tasks = [...this.tasksSubject.value, newTask];
    this.tasksSubject.next(tasks);

    const currentLogs = { ...this.taskLogsSubject.value };
    currentLogs[newTaskId] = [
      `Task created manually by Human Administrator.`,
      `Risk tier evaluated: ${risk.toUpperCase()}.`,
      `Assigned to Agent: ${agentId}`
    ];
    this.taskLogsSubject.next(currentLogs);

    setTimeout(() => {
      this.startTask(newTaskId);
    }, 500);
  }

  setSimulationSpeed(speed: number) {
    this.simulationSpeedSubject.next(speed);
  }
}
