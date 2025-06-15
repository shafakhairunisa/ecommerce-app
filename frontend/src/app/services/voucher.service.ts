import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = '/api/user-vouchers'; // Adjust if needed

  constructor(private http: HttpClient) {}

  getAvailableVouchers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available`);
  }
}
