import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '@services/admin-dashboard.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  months: string[] = [];
  allData: any = {};
  chart: any;

  constructor(private adminService: AdminDashboardService) {}

  ngOnInit(): void {
    this.adminService.getAdminData().subscribe({
      next: (data) => {
        this.allData = data.graph;
        this.months = this.allData.map((monthData: any) => monthData.month);
        this.renderChart(this.allData[0].weeks); // Initialize chart with the first month's data
      },
    });
  }

  onMonthChange(selectedMonth: string): void {
    const selectedData = this.allData.find(
      (monthData: any) => monthData.month === selectedMonth,
    ).weeks;
    this.updateChart(selectedData);
  }

  updateChart(data: number[]): void {
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  renderChart(data: number[]) {
    const ctx = (
      document.getElementById('area-chart') as HTMLCanvasElement
    ).getContext('2d');

    // Create a vertical gradient from top (darker) to bottom (lighter)
    const gradient = ctx.createLinearGradient(0, 150, 0, 200);
    gradient.addColorStop(0, 'rgba(151, 71, 255, 0.35)'); // Top color (darker)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    const myChart = new Chart(ctx, {
      type: 'line', // Change chart type to 'line'
      data: {
        labels: [
          'الأسبوع الأول',
          'الأسبوع الثاني',
          'الأسبوع الثالث',
          'الأسبوع الرابع',
          'الأسبوع الخامس',
        ],
        datasets: [
          {
            data,
            backgroundColor: gradient, // Color of the fill area
            borderColor: '#AE35FF', // Color of the line
            borderWidth: 2,
            fill: true, // Enable area filling
            tension: 0.3, // Smoothness of the line (0 for sharp edges, 1 for very smooth)
          },
        ],
      },
      options: {
        indexAxis: 'x', // For horizontal area chart
        scales: {
          x: {
            reverse: true, // Reverse the x-axis
            position: 'bottom', // Position the x-axis at the bottom
            grid: {
              display: false, // Hide the x-axis grid lines
            },
            border: {
              display: false, // Hide the x-axis border
            },
            ticks: {
              padding: 10, // Add padding to the x-axis labels
            },
          },
          y: {
            beginAtZero: true,
            position: 'right', // Position the y-axis on the right
            grid: {
              display: true, // Display the y-axis grid lines
            },
            border: {
              display: false, // Hide the y-axis border
            },
            ticks: {
              maxTicksLimit: 6, // Limit the number of ticks to 5
            },
          },
        },
        layout: {
          padding: {
            right: 15, // Adjust padding as needed
            left: 35, // Adjust padding as needed
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }

  // renderChart() {
  //   const ctx = (
  //     document.getElementById('area-chart') as HTMLCanvasElement
  //   ).getContext('2d');

  //   // Create a vertical gradient from top (darker) to bottom (lighter)
  //   const gradient = ctx.createLinearGradient(0, 150, 0, 200);
  //   gradient.addColorStop(0, 'rgba(151, 71, 255, 0.35)'); // Top color (darker)
  //   gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  //   const myChart = new Chart(ctx, {
  //     type: 'line', // Change chart type to 'line'
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [
  //         {
  //           data: [600, 350, 900, 100, 500, 70],
  //           backgroundColor: gradient, // Color of the fill area
  //           borderColor: '#AE35FF', // Color of the line
  //           borderWidth: 2,
  //           fill: true, // Enable area filling
  //           tension: 0.3, // Smoothness of the line (0 for sharp edges, 1 for very smooth)
  //         },
  //       ],
  //     },
  //     options: {
  //       indexAxis: 'x', // For horizontal area chart
  //       scales: {
  //         x: {
  //           reverse: true, // Reverse the x-axis
  //           position: 'bottom', // Position the x-axis at the bottom
  //           grid: {
  //             display: false, // Hide the x-axis grid lines
  //           },
  //           border: {
  //             display: false, // Hide the x-axis border
  //           },
  //         },
  //         y: {
  //           beginAtZero: true,
  //           position: 'right', // Position the y-axis on the right
  //           grid: {
  //             display: true, // Display the y-axis grid lines
  //           },
  //           border: {
  //             display: false, // Hide the y-axis border
  //           },
  //           ticks: {
  //             maxTicksLimit: 6, // Limit the number of ticks to 5
  //           },
  //         },
  //       },
  //       layout: {
  //         padding: {
  //           right: 20, // Adjust padding as needed
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           display: false, // Hide the legend
  //         },
  //       },
  //     },
  //   });
  // }
}
