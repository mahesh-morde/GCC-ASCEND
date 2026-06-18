import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService, SecurityLog, AgentMetrics } from '../../services/security.service';
import { SimulationService } from '../../services/simulation.service';
import { Agent } from '../../models/agent.model';

@Component({
  selector: 'app-sentinel',
  templateUrl: './sentinel.component.html',
  styleUrls: ['./sentinel.component.css']
})
export class SentinelComponent implements OnInit, OnDestroy {
  logs: SecurityLog[] = [];
  metricsHistory: { [agentId: string]: AgentMetrics[] } = {};
  quarantinedAgents = new Set<string>();
  agents: Agent[] = [];
  hasActiveThreat = false;

  // Selected agent for live chart
  selectedChartAgentId = 'finance-agent';

  // Exploit injection target fields
  injectTargetAgentId = 'hr-agent';
  injectThreatType: 'prompt-injection' | 'signature-spoofing' | 'hallucination' = 'prompt-injection';

  private sub = new Subscription();

  // SVG dimensions for chart
  chartWidth = 460;
  chartHeight = 150;

  constructor(
    private securityService: SecurityService,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.securityService.securityLogs$.subscribe(l => {
        this.logs = l;
      })
    );

    this.sub.add(
      this.securityService.metricsHistory$.subscribe(mh => {
        this.metricsHistory = mh;
      })
    );

    this.sub.add(
      this.securityService.quarantinedAgents$.subscribe(qa => {
        this.quarantinedAgents = qa;
      })
    );

    this.sub.add(
      this.securityService.activeThreat$.subscribe(at => {
        this.hasActiveThreat = at;
      })
    );

    this.sub.add(
      this.simulationService.agents$.subscribe(a => {
        this.agents = a;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAgentName(agentId: string): string {
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? agent.name.split(' (')[0] : agentId;
  }

  triggerExploit() {
    const target = this.agents.find(a => a.id === this.injectTargetAgentId);
    if (!target) return;

    this.securityService.injectThreat(
      this.injectTargetAgentId,
      target.name,
      this.injectThreatType
    );
  }

  mitigateAll() {
    this.securityService.resolveThreats();
  }

  getMetricsForSelected(): AgentMetrics[] {
    return this.metricsHistory[this.selectedChartAgentId] || [];
  }

  getEntropyPath(): string {
    const metrics = this.getMetricsForSelected();
    if (metrics.length < 2) return '';

    const widthStep = this.chartWidth / (metrics.length - 1);
    return metrics.map((m, i) => {
      const x = i * widthStep;
      // Entropy runs 0 to 1, map to height
      const y = this.chartHeight - 15 - (m.entropy * (this.chartHeight - 30));
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  getAnomalyPath(): string {
    const metrics = this.getMetricsForSelected();
    if (metrics.length < 2) return '';

    const widthStep = this.chartWidth / (metrics.length - 1);
    return metrics.map((m, i) => {
      const x = i * widthStep;
      // Anomaly Index runs 0 to 100, map to height
      const y = this.chartHeight - 15 - ((m.anomalyIndex / 100) * (this.chartHeight - 30));
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  getAnomalyFillPath(): string {
    const linePath = this.getAnomalyPath();
    if (!linePath) return '';
    // Close the path to form a shape for gradient fills
    const lastX = this.chartWidth;
    return `${linePath} L ${lastX} ${this.chartHeight} L 0 ${this.chartHeight} Z`;
  }

  getLatestMetricValue(type: 'entropy' | 'anomalyIndex' | 'responseSpeed'): string {
    const metrics = this.getMetricsForSelected();
    if (metrics.length === 0) return '0';
    const latest = metrics[metrics.length - 1];

    if (type === 'entropy') {
      return latest.entropy.toFixed(3);
    } else if (type === 'anomalyIndex') {
      return `${latest.anomalyIndex.toFixed(1)}%`;
    } else {
      return `${latest.responseSpeed.toFixed(0)}ms`;
    }
  }
}
