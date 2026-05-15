import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { dashboardService } from '../../../Services/dashboard';
import { OrderService } from '../../../Services/order-services';
import { ToastrService } from 'ngx-toastr';
import { ChartConfiguration } from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
} from 'chart.js';
import { Loader } from '../../loader/loader';
import { environment } from '../../../../environments/environment';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective, RouterLink, Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  data: any = {
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalVisits: 0,
    },
    recentOrders: [],
    newUsers: [],
    bestSellers: [],
    lowStock: [],
    outOfStock: [],
  };
  loading = true;
  errorMessage: string = '';
  openDropdown: string | null = null;
  deletePopupVisible = false;
  deleteId: string | null = null;
  salesFilter: 'daily' | 'weekly' = 'daily';

  constructor(
    private dashboardService: dashboardService,
    private orderService: OrderService,
    private toastr: ToastrService,
  ) {}

  // Daily and Weekly Data
  dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [4200, 5500, 4800, 6200, 5900, 7100, 6500],
  };

  weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [28000, 35000, 32000, 42000],
  };

  // Sales Line Chart
  salesChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.dailyData.labels,
    datasets: [
      {
        data: this.dailyData.data,
        label: 'Sales (EGP)',
        fill: true,
        tension: 0.4,
        borderColor: '#fe5100',
        backgroundColor: 'rgba(254, 81, 0, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#fe5100',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  salesChartType: 'line' = 'line';

  // Orders Bar Chart
  ordersChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [65, 85, 70, 95],
        label: 'This Month',
        backgroundColor: '#fe5100',
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 30,
      },
      {
        data: [55, 75, 65, 80],
        label: 'Last Month',
        backgroundColor: '#ffb870',
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 30,
      },
    ],
  };

  ordersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 15,
            weight: 700,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  ordersChartType: 'bar' = 'bar';

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe({
      next: (res) => {
        console.log('Dashboard data received:', res);

        const placeholderImage =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

        const buildImage = (image?: string, images?: string[]) => {
          const fromArray = images?.find(Boolean);
          const picked = fromArray || image || '';
          if (picked.includes('via.placeholder.com')) return placeholderImage;
          if (!picked) return placeholderImage;
          if (
            picked.startsWith('http://') ||
            picked.startsWith('https://') ||
            picked.startsWith('data:')
          )
            return picked;
          // assume relative path from backend
          return `${environment.apiUrl}${picked.startsWith('/') ? '' : '/'}${picked}`;
        };

        // Merge API data with default structure
        this.data = {
          stats: res.stats || {
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0,
            totalVisits: 0,
          },
          recentOrders: res.recentOrders || [],
          newUsers: res.newUsers || [],
          bestSellers: (res.bestSellers || []).map((p: any) => ({
            ...p,
            image: buildImage(p.image, p.images), // Prefer order image, then first product image, and normalize URL
          })),
          lowStock: (res.lowStock || []).map((p: any) => ({
            ...p,
            image: buildImage(p.image, p.images), // Use p.image from backend first, then fallback to images array
          })),
          outOfStock: (res.outOfStock || []).map((p: any) => ({
            ...p,
            image: buildImage(p.image, p.images), // Use p.image from backend first, then fallback to images array
          })),
        };

        console.log(
          '✅ Product Images - Best Sellers:',
          this.data.bestSellers.map((p: any) => ({ name: p.name, image: p.image })),
        );
        console.log(
          '✅ Product Images - Low Stock:',
          this.data.lowStock.map((p: any) => ({ name: p.name, image: p.image })),
        );
        console.log(
          '✅ Product Images - Out of Stock:',
          this.data.outOfStock.map((p: any) => ({ name: p.name, image: p.image })),
        );

        // 🟦 Sales chart - Update only if API data exists
        if (res.salesChart && res.salesChart.length > 0) {
          console.log('Updating sales chart with API data:', res.salesChart);
          const labels = res.salesChart.map((i: any) => i.date);
          const data = res.salesChart.map((i: any) => i.value);
          this.salesChartData = {
            labels: labels,
            datasets: [
              {
                ...this.salesChartData.datasets[0],
                data: data,
              },
            ],
          };
          // Force chart update
          this.salesChartData = { ...this.salesChartData };
        } else {
          console.warn('No sales chart data received:', res.salesChart);
        }

        // 🟩 Orders chart - Update only if API data exists
        if (res.ordersChart && res.ordersChart.length > 0) {
          console.log('Updating orders chart with API data:', res.ordersChart);
          const labels = res.ordersChart.map((i: any) => `Week ${i.week}`);
          const data = res.ordersChart.map((i: any) => i.count);
          this.ordersChartData = {
            labels: labels,
            datasets: [
              {
                ...this.ordersChartData.datasets[0],
                data: data,
              },
            ],
          };
          // Force chart update
          this.ordersChartData = { ...this.ordersChartData };
        } else {
          console.warn('No orders chart data received:', res.ordersChart);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        console.error('Error details:', err.error, err.status);

        // Set user-friendly error message
        if (err.status === 401) {
          this.errorMessage = 'Unauthorized: Please login again.';
        } else if (err.status === 403) {
          this.errorMessage = 'Forbidden: You do not have permission to view this dashboard.';
        } else if (err.status === 0) {
          this.errorMessage = 'Connection error: Backend server is not running on localhost:3000';
        } else {
          this.errorMessage = err.error?.message || 'Failed to load dashboard data';
        }

        this.loading = false;
      },
    });
  }

  toggleDropdown(orderId: string) {
    this.openDropdown = this.openDropdown === orderId ? null : orderId;
  }

  setSalesFilter(filter: 'daily' | 'weekly') {
    this.salesFilter = filter;
    const selectedData = filter === 'daily' ? this.dailyData : this.weeklyData;

    this.salesChartData = {
      labels: selectedData.labels,
      datasets: [
        {
          data: selectedData.data,
          label: 'Sales (EGP)',
          fill: true,
          tension: 0.4,
          borderColor: '#fe5100',
          backgroundColor: 'rgba(254, 81, 0, 0.1)',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#fe5100',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  }

  deleteOrder(orderId: string) {
    console.log('deleteOrder called with:', orderId);
    this.deleteId = orderId;
    this.deletePopupVisible = true;
    console.log('deletePopupVisible set to:', this.deletePopupVisible);
    this.openDropdown = null;
  }

  confirmDeleteOrder() {
    if (!this.deleteId) return;

    this.orderService.deleteOrder(this.deleteId).subscribe({
      next: () => {
        this.toastr.success('Order deleted successfully', 'Success');
        this.deletePopupVisible = false;
        this.deleteId = null;
        // Reload dashboard data after deletion
        this.ngOnInit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to delete order', 'Error');
        console.error('Error deleting order:', err);
      },
    });
  }
}
