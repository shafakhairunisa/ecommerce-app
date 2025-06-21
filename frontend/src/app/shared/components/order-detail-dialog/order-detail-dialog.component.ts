import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../../core/models/order.model';
import { ImageService } from '../../../core/services/image.service';

export interface OrderDetailDialogData {
  order: Order;
}

@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.css'],
})
export class OrderDetailDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogData,
    private imageService: ImageService
  ) {}
  
  ngOnInit(): void {
    // No initialization needed
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getProductImagePath(product: any): string {
    if (!product || !product.category || !product.name) {
      return this.imageService.getDefaultImageUrl();
    }
    
    // If product has an imagePath, use it
    if (product.imagePath) {
      return this.imageService.getSafeUrl(product.imagePath);
    }
    
    // Otherwise try to get an image based on category and name
    return this.imageService.getSafeProductImageUrl(product.category, product.name);
  }
  
  handleImageError(event: any, product: any): void {
    // Mark this URL as failed so we don't try to load it again
    const imgElement = event.target;
    this.imageService.markImageAsFailed(imgElement.src);
    
    // Try to get a static product image based on the product name
    if (product && product.name) {
      const lowerName = product.name.toLowerCase();
      
      if (lowerName.includes('minyak bidara') && lowerName.includes('45ml')) {
        // Use the 45ML Minyak Bidara image
        imgElement.src = 'assets/logo.png';
        return;
      } else if (lowerName.includes('minyak bidara') && lowerName.includes('120ml')) {
        // Use the 120ML Minyak Bidara image
        imgElement.src = 'assets/logo.png';
        return;
      } else if (lowerName.includes('zafaran') || lowerName.includes('saffron')) {
        imgElement.src = 'assets/mee-tarik-saffron.png';
        return;
      } else if (lowerName.includes('madu minda')) {
        imgElement.src = 'assets/logo.png';
        return;
      } else if (lowerName.includes('tomyam')) {
        imgElement.src = 'assets/tomyam-odeen.png';
        return;
      } else if (lowerName.includes('perisa kari')) {
        imgElement.src = 'assets/perisa-kari.png';
        return;
      } else if (lowerName.includes('sup')) {
        imgElement.src = 'assets/sup.png';
        return;
      }
    }
    
    // Set to default image as last resort
    imgElement.src = 'assets/logo.png';
  }
} 