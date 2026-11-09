import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgentPerformanceByRegionComponent } from './agent-performance-by-region.component';
import { environment } from '../../../../environments/environment';

describe('AgentPerformanceByRegionComponent', () => {
  let component: AgentPerformanceByRegionComponent;
  let fixture: ComponentFixture<AgentPerformanceByRegionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgentPerformanceByRegionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceByRegionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Agent Performance By Region"', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Agent Performance By Region');

    const request = httpMock.expectOne(
      `${environment.apiBaseUrl}/reports/agent-performance/by-region`
    );
    request.flush([]);
  });

  it('should retrieve and display agent performance data by region', () => {
    fixture.detectChanges();

    const mockData = [
      { region: 'Africa', averagePerformance: 81 },
      { region: 'Asia', averagePerformance: 80 },
      { region: 'Europe', averagePerformance: 79 }
    ];

    const request = httpMock.expectOne(
      `${environment.apiBaseUrl}/reports/agent-performance/by-region`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockData);

    expect(component.regions).toEqual(['Africa', 'Asia', 'Europe']);
    expect(component.averagePerformance).toEqual([81, 80, 79]);
    expect(component.showChart).toBeTrue();

    fixture.detectChanges();

    const chartElement = fixture.nativeElement.querySelector('app-chart');
    expect(chartElement).toBeTruthy();
  });
});