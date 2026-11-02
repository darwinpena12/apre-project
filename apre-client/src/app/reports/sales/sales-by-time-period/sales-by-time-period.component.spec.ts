
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SalesByTimePeriodComponent } from './sales-by-time-period.component';
import { environment } from '../../../../environments/environment';

describe('SalesByTimePeriodComponent', () => {
  let component: SalesByTimePeriodComponent;
  let fixture: ComponentFixture<SalesByTimePeriodComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesByTimePeriodComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByTimePeriodComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Time Period"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Time Period');
  });

  it('should not fetch sales data if dates are not selected', () => {
    spyOn(window, 'alert');

    component.fetchSalesData();

    expect(window.alert).toHaveBeenCalledWith(
      'Please select both start and end dates.'
    );

    httpMock.expectNone(() => true);
  });

  it('should fetch sales data and update the chart data', () => {
    component.startDate = new Date(2023, 8, 1);
    component.endDate = new Date(2023, 8, 2);

    component.fetchSalesData();

    const request = httpMock.expectOne(
      `${environment.apiBaseUrl}/reports/sales/by-time-period?startDate=2023-09-01&endDate=2023-09-02`
    );

    expect(request.request.method).toBe('GET');

    request.flush([
      { date: '2023-09-01', totalSales: 150 },
      { date: '2023-09-02', totalSales: 250 }
    ]);

    expect(component.salesDates).toEqual([
      '2023-09-01',
      '2023-09-02'
    ]);

    expect(component.totalSalesData).toEqual([150, 250]);
    expect(component.showChart).toBeTrue();
  });
});
