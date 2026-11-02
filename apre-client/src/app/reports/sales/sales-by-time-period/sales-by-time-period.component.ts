import { Component } from '@angular/core';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sales-by-time-period',
  standalone: true,
  imports: [CalendarComponent, CommonModule, ChartComponent],
    template: `
    <div>
      <h1>Sales by Time Period</h1>

      <div class="calendar-form">
        <div class="calendar-form__group">
          <div class="calendar-form__item">
            <div class="calendar-form__label">Start Date:</div>
            <app-calendar (dateSelected)="onStartDateSelected($event)"></app-calendar>
          </div>

          <div class="calendar-form__item">
            <div class="calendar-form__label">End Date:</div>
            <app-calendar (dateSelected)="onEndDateSelected($event)"></app-calendar>
          </div>
        </div>

        <div class="calendar-form__actions">
          <button class="button button--primary" (click)="fetchSalesData()">Submit</button>
        </div>
      </div>
      <br />

      <div *ngIf="showChart" class="chart-container">
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Time Period'"
            [data]="totalSalesData"
            [labels]="salesDates">
          </app-chart>
        </div>
      </div>
    </div>
  `
})
export class SalesByTimePeriodComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;

  totalSalesData: number[] = [];
  salesDates: string[] = [];

  showChart: boolean = false;

  constructor(private http: HttpClient) {}

  onStartDateSelected(date: Date) {
    this.startDate = date;
    console.log('Start Date selected: ', date);
  }

  onEndDateSelected(date: Date) {
    if (this.startDate && date < this.startDate) {
      alert('End date must be after the start date.');
      return;
    }
    this.endDate = date;
    console.log('End Date selected: ', date);
  }

  fetchSalesData() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (this.startDate > this.endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    const startDate = this.formatDate(this.startDate);
    const endDate = this.formatDate(this.endDate);

    this.http.get<{ date: string; totalSales: number }[]>(
      `${environment.apiBaseUrl}/reports/sales/by-time-period?startDate=${startDate}&endDate=${endDate}`
    ).subscribe({
      next: (data) => {
        this.salesDates = data.map((item) => item.date);
        this.totalSalesData = data.map((item) => item.totalSales);
        this.showChart = true;

        console.log('Sales by time period: ', data);
      },
      error: (error) => {
        console.error('Error fetching sales by time period: ', error);
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
