import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Voucher } from '../model/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  constructor() {}

  getAvailableVouchers(): Observable<Voucher[]> {
    const vouchers: Voucher[] = [
      {
        name: '3% Discount',
        minPurchase: 50,
        description: 'Get 3% off when you spend RM50 or more!',
        imageUrl: 'assets/Voucher/3percent.jpg'
      },
      {
        name: '5% Discount',
        minPurchase: 100,
        description: 'Save 5% when your purchase is RM100 or more!',
        imageUrl: 'assets/Voucher/5percent.jpg'
      },
      {
        name: '8% Discount',
        minPurchase: 200,
        description: 'Enjoy 8% off on orders RM200 and above!',
        imageUrl: 'assets/Voucher/8percent.jpg'
      }
    ];

    return of(vouchers);
  }
}
