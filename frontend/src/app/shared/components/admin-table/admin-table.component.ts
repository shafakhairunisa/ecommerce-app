import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ImageService } from '../../../core/services/image.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
})
export class AdminTableComponent {
  @Input() columns: { key: string, header: string }[] = [];
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  // Pagination properties
  pageSize = 10;
  currentPage = 0;
  
  constructor(private imageService: ImageService) {}
  
  get displayedColumns() {
    return [...this.columns.map(c => c.key), 'actions'];
  }
  
  get isProductTable(): boolean {
    // Check if this is a product table by looking for product-specific fields
    return this.data.length > 0 && 
           'name' in this.data[0] && 
           'price' in this.data[0] &&
           'category' in this.data[0];
  }
  
  get paginatedData(): any[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  
  getProductImagePath(product: Product): string {
    if (!product.category || !product.name) {
      return this.imageService.getDefaultImageUrl();
    }
    
    // If product has an imagePath, make sure it uses .png extension
    if (product.imagePath) {
      if (!product.imagePath.toLowerCase().endsWith('.png')) {
        const fixedPath = product.imagePath.replace(/\.[^.]+$/, '.png');
        return this.imageService.getSafeUrl(fixedPath);
      }
      return this.imageService.getSafeUrl(product.imagePath);
    }
    
    return this.imageService.getSafeProductImageUrl(product.category, product.name);
  }
  
  handleImageError(event: any, product: Product): void {
    // Mark this URL as failed so we don't try to load it again
    const imgElement = event.target;
    this.imageService.markImageAsFailed(imgElement.src);
    
    // Set to default image
    imgElement.src = this.imageService.getDefaultImageUrl();
  }
} 