import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: 'cyber-neon' | 'amber-obsidian' | 'crystal-light' = 'crystal-light';
  hasActiveThreat = false;
  activeTally = { completed: 0, pending: 0 };
  simSpeed = 1;

  constructor(
    private securityService: SecurityService,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    // Read theme from localStorage or default
    const savedTheme = localStorage.getItem('ascendo-theme');
    if (savedTheme === 'cyber-neon' || savedTheme === 'amber-obsidian' || savedTheme === 'crystal-light') {
      this.currentTheme = savedTheme;
    } else {
      this.currentTheme = 'crystal-light';
    }
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Subscribe to threat alarms
    this.securityService.activeThreat$.subscribe(threat => {
      this.hasActiveThreat = threat;
    });

    // Subscribe to task list to update active counts
    this.simulationService.tasks$.subscribe(tasks => {
      this.activeTally = {
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status !== 'completed').length
      };
    });

    // Subscribe to speed updates
    this.simulationService.simulationSpeed$.subscribe(speed => {
      this.simSpeed = speed;
    });
  }

  toggleTheme() {
    if (this.currentTheme === 'cyber-neon') {
      this.currentTheme = 'amber-obsidian';
    } else if (this.currentTheme === 'amber-obsidian') {
      this.currentTheme = 'crystal-light';
    } else {
      this.currentTheme = 'cyber-neon';
    }
    localStorage.setItem('ascendo-theme', this.currentTheme);
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  changeSpeed(speed: number) {
    this.simulationService.setSimulationSpeed(speed);
  }

  resolveAlarm() {
    this.securityService.resolveThreats();
  }
}
