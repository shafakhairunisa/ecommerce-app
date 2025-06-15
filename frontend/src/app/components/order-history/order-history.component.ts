import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: any[] = [];

  ngOnInit(): void {
    const stored = localStorage.getItem('orderHistory');
    this.orderHistory = stored ? JSON.parse(stored) : [];
  }
}
