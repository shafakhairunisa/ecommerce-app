import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VoucherInfo {
  title: string;
  description: string;
  minAmount: number;
  discountPercentage: number;
  terms: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = `${environment.apiUrl}/vouchers`;

  constructor(private http: HttpClient) {}

  getVoucherInfo(): Observable<VoucherInfo[]> {
    return this.http.get<VoucherInfo[]>(`${this.apiUrl}/info`);
  }

  calculateDiscount(amount: number): { percentage: number; discountAmount: number; finalAmount: number } {
    let percentage = 0;
    
    if (amount >= 200) {
      percentage = 10;
    } else if (amount >= 100) {
      percentage = 5;
    } else if (amount >= 50) {
      percentage = 3;
    }
    
    const discountAmount = (amount * percentage) / 100;
    const finalAmount = amount - discountAmount;
    
    return {
      percentage,
      discountAmount,
      finalAmount
    };
  }
}
