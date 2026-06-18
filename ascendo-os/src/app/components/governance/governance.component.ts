import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationService, Handshake } from '../../services/simulation.service';
import { SecurityService } from '../../services/security.service';
import { Policy } from '../../models/policy.model';
import { Agent } from '../../models/agent.model';

@Component({
  selector: 'app-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.css']
})
export class GovernanceComponent implements OnInit, OnDestroy {
  handshakes: Handshake[] = [];
  policies: Policy[] = [];
  agents: Agent[] = [];
  selectedHandshakeId: string | null = null;
  activeGovTab: 'registry' | 'tester' | 'proof' = 'registry';

  // Consensus Policy Tester States
  testerPolicyId = 'pol-1';
  testerSignatories: { [agentId: string]: boolean } = {
    'finance-agent': true,
    'hr-agent': false,
    'it-agent': false,
    'security-agent': false
  };

  private sub = new Subscription();

  constructor(
    private simulationService: SimulationService,
    private securityService: SecurityService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.simulationService.handshakes$.subscribe(hs => {
        this.handshakes = hs;
        if (!this.selectedHandshakeId && hs.length > 0) {
          this.selectedHandshakeId = hs[0].id;
        }
      })
    );

    this.sub.add(
      this.simulationService.policies$.subscribe(p => {
        this.policies = p;
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

  selectHandshake(id: string) {
    this.selectedHandshakeId = id;
    this.activeGovTab = 'proof';
  }

  getSelectedHandshake(): Handshake | undefined {
    return this.handshakes.find(h => h.id === this.selectedHandshakeId);
  }

  getAgentKey(agentId: string): string {
    const hex = agentId.split('').reduce((acc, char) => acc + char.charCodeAt(0).toString(16), '').substring(0, 12).toUpperCase();
    return `KP_ED25519_GCC_${hex}`;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  getSelectedTesterPolicy(): Policy | undefined {
    return this.policies.find(p => p.id === this.testerPolicyId);
  }

  getTesterSignatoryCount(): number {
    return Object.values(this.testerSignatories).filter(Boolean).length;
  }

  isTesterConsensusSatisfied(): boolean {
    const policy = this.getSelectedTesterPolicy();
    if (!policy) return false;
    return this.getTesterSignatoryCount() >= policy.requiredSignatures;
  }

  toggleTesterSignatory(agentId: string) {
    this.testerSignatories[agentId] = !this.testerSignatories[agentId];
  }

  getTesterStatusHash(): string {
    const keys = Object.keys(this.testerSignatories)
      .filter(k => this.testerSignatories[k])
      .sort()
      .join('-');
    if (!keys) return '0x0000000000000000';
    let hash = 0;
    for (let i = 0; i < keys.length; i++) {
      hash = (hash << 5) - hash + keys.charCodeAt(i);
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
  }

  revokeAgent(agentId: string, agentName: string) {
    this.securityService.revokeAgent(agentId, agentName);
  }
}
