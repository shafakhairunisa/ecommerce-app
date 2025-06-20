import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService, Product } from '../../services/admin.service';
import { OrderService } from '../../services/order.service';

interface DashboardData {
  userCount: number;
  userGrowth: number;
  productCount: number;
  productGrowth: number;
  orderCount: number;
  orderGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  lowStockProducts: any[];
  recentOrders: any[];
  salesByCategory: any[];
  recentActivity: any[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  dashboardData: DashboardData = {
    userCount: 0,
    userGrowth: 0,
    productCount: 0,
    productGrowth: 0,
    orderCount: 0,
    orderGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    lowStockProducts: [],
    recentOrders: [],
    salesByCategory: [],
    recentActivity: [],
  };

  constructor(
    public router: Router,
    private adminService: AdminService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Only load dashboard data if we're on the main admin page
    if (this.router.url === '/admin') {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    // Load users data
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.dashboardData.userCount = users.length;
        this.dashboardData.userGrowth = 5; // Placeholder: calculate from actual data

        // Add recent user registrations to activity feed
        const recentUsers = users.slice(0, 2);
        recentUsers.forEach((user) => {
          this.dashboardData.recentActivity.push({
            type: 'user',
            description: `New user registered: ${user.username}`,
            time: user.createdAt,
          });
        });
      },
      error: (error) => console.error('Error loading users:', error),
    });

    // Load products data
    this.adminService.getProducts().subscribe({
      next: (productsData) => {
        this.dashboardData.productCount = productsData.length;
        this.dashboardData.productGrowth = 3; // Placeholder: calculate from actual data

        // Find low stock products
        this.dashboardData.lowStockProducts = productsData
          .filter((p) => p.stock < 10) // Using stock property from your Product interface
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            name: p.name,
            stock: p.stock, // Using stock property from your Product interface
            imageUrl: p.imageUrl || 'assets/placeholder.png',
          }));

        // Generate sales by category data
        const categories = [
          ...new Set(productsData.map((p) => p.category)),
        ].filter(Boolean);
        this.dashboardData.salesByCategory = categories.map((category) => {
          const percentage = Math.floor(Math.random() * 100); // Placeholder: calculate from actual sales
          return {
            name: category,
            sales: Math.floor(Math.random() * 10000), // Placeholder: calculate from actual sales
            percentage,
          };
        });

        // Add recent product updates to activity feed
        const recentProducts = productsData.slice(0, 2);
        recentProducts.forEach((product: Product) => {
          this.dashboardData.recentActivity.push({
            type: 'product',
            description: `Product added: ${product.name}`,
            time: new Date(), // Placeholder: use actual creation date
          });
        });
      },
      error: (error) => console.error('Error loading products:', error),
    });

    // Load orders data
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.dashboardData.orderCount = orders.length;
        this.dashboardData.orderGrowth = 8; // Placeholder: calculate from actual data

        // Calculate total revenue
        this.dashboardData.totalRevenue = orders.reduce(
          (total, order) => total + order.total,
          0
        );
        this.dashboardData.revenueGrowth = 12; // Placeholder: calculate from actual data

        // Get recent orders
        this.dashboardData.recentOrders = orders.slice(0, 5);

        // Add recent orders to activity feed
        const recentOrdersForActivity = orders.slice(0, 3);
        recentOrdersForActivity.forEach((order) => {
          this.dashboardData.recentActivity.push({
            type: 'order',
            description: `New order #${order.id} placed: ${order.total.toFixed(
              2
            )}`,
            time: order.createdAt,
          });
        });

        // Sort activity by time (newest first)
        this.dashboardData.recentActivity.sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
      },
      error: (error) => console.error('Error loading orders:', error),
    });
  }
}
