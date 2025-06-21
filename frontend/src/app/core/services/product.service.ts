import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilter } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query?: string, category?: string, sortOrder?: string): Observable<Product[]> {
    let url = `${this.apiUrl}/search?`;
    if (query) url += `query=${query}&`;
    if (category) url += `category=${category}&`;
    if (sortOrder) url += `sortOrder=${sortOrder}`;
    return this.http.get<Product[]>(url);
  }

  // Combined method for search, filter, and sort
  getFilteredProducts(params: ProductFilter): Observable<Product[]> {
    let url = `${this.apiUrl}/search-filter-sort?`;
    const queryParams: string[] = [];
    
    if (params.query) queryParams.push(`query=${encodeURIComponent(params.query)}`);
    if (params.category) queryParams.push(`category=${encodeURIComponent(params.category)}`);
    if (params.sortOrder) queryParams.push(`sortOrder=${params.sortOrder}`);
    
    url += queryParams.join('&');
    return this.http.get<Product[]>(url);
  }

  // Admin only endpoints
  createProduct(product: Product): Observable<Product> {
    console.log('Creating product with complete data:', product);
    if (!product.imageUrl) {
      console.warn('Warning: Creating product without imageUrl!');
    }
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    console.log('Updating product with ID:', id);
    console.log('Updating product with complete data:', product);
    
    // Ensure the product has the correct ID
    product.productId = id;
    
    if (!product.imageUrl) {
      console.warn('Warning: Updating product without imageUrl!');
    }
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 