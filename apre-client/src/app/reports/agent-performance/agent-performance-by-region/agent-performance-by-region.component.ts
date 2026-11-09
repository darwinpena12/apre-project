import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agent-performance-by-region',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './agent-performance-by-region.component.html',
  styleUrl: './agent-performance-by-region.component.css'
})
export class AgentPerformanceByRegionComponent implements OnInit {
  regions: string[] = [];
  averagePerformance: number[] = [];
  showChart = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPerformanceData();
  }

  fetchPerformanceData(): void {
    this.http.get<{ region: string; averagePerformance: number }[]>(
      `${environment.apiBaseUrl}/reports/agent-performance/by-region`
    ).subscribe({
      next: data => {
        this.regions = data.map(item => item.region);
        this.averagePerformance = data.map(item => item.averagePerformance);
        this.showChart = true;
      },
      error: error => {
        console.error('Error fetching agent performance by region:', error);
      }
    });
  }
}