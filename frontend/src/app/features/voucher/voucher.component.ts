import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherService, VoucherInfo } from '../../core/services/voucher.service';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [CommonModule, CustomerHeaderComponent],
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  vouchers: VoucherInfo[] = [];
  loading = true;
  error: string | null = null;

  constructor(private voucherService: VoucherService) {}

  ngOnInit(): void {
    this.loadVouchers();
  }

  loadVouchers(): void {
    this.voucherService.getVoucherInfo().subscribe({
      next: (vouchers) => {
        this.vouchers = vouchers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vouchers:', error);
        this.error = 'Failed to load voucher information';
        this.loading = false;
      }
    });
  }
}
