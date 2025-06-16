import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../services/voucher.service';
import { Voucher } from '../../model/voucher.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  imports: [CommonModule]  // ✅ Import this
})
export class VoucherComponent implements OnInit {
  vouchers: Voucher[] = [];

  constructor(private voucherService: VoucherService) {}

  ngOnInit(): void {
    this.voucherService.getAvailableVouchers().subscribe({
      next: (data) => this.vouchers = data,
      error: (err) => console.error('Failed to load vouchers:', err)
    });
  }
}
