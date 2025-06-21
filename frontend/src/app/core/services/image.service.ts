import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;
  
  // Dynamic cache of known image extensions - will be populated at runtime
  // We'll always use PNG for consistency
  private imageExtensionCache: Map<string, string> = new Map();
  
  // Cache for failed image URLs to prevent repeated requests
  private failedImageUrls: Set<string> = new Set();
  
  // Special case mappings for known files with different casing
  private specialCaseMappings: Record<string, string> = {
    'KOPI IBNU SINA': 'Kopi Ibnu Sina',
    'TEH IBNU SINA': 'Teh Ibnu Sina'
  };
  
  constructor(private http: HttpClient) { }

  /**
   * Gets the URL for a product image based on product category and name
   * Uses the exact filename format from the QurbaProductPhoto directory
   * 
   * @param category Product category (e.g., 'Minuman', 'Mee', 'Rempah', etc.)
   * @param productName Product name to use for finding the image
   * @param imagePath Optional saved image path from the database
   * @returns URL to the product image
   */
  getProductImageUrl(category: string, productName: string, imagePath?: string): string {
    // If a specific image path is provided, convert it to the appropriate format
    if (imagePath) {
      return this.convertToApiUrl(imagePath);
    }
    
    if (!category || !productName) {
      return this.getDefaultImageUrl();
    }
    
    // Normalize category for path consistency
    const normalizedCategory = this.normalizeCategory(category);
    
    // Handle special case mappings for known files with different casing
    let fileNameToUse = productName;
    const upperProductName = productName.toUpperCase();
    
    if (this.specialCaseMappings[upperProductName]) {
      fileNameToUse = this.specialCaseMappings[upperProductName];
    }
    
    // Create the image URL
    const imageUrl = `${environment.apiUrl}/images/product/${normalizedCategory}/${fileNameToUse}.png`;
    
    // Check if this URL has previously failed to prevent repeated requests
    if (this.failedImageUrls.has(imageUrl)) {
      return this.getDefaultImageUrl();
    }
    
    return imageUrl;
  }

  /**
   * Gets the URL for a product image based on product category and name
   * Falls back to a default image if the specified image doesn't exist
   * 
   * @param category Product category
   * @param productName Product name
   * @param imagePath Optional saved image path from the database
   * @returns URL to the product image with error handling
   */
  getSafeProductImageUrl(category: string, productName: string, imagePath?: string): string {
    try {
      // If we have an imagePath, convert it to API URL
      if (imagePath) {
        const apiUrl = this.convertToApiUrl(imagePath);
        return apiUrl;
      }
      
      // Check if this is a special case
      const upperProductName = productName.toUpperCase();
      if (this.specialCaseMappings[upperProductName]) {
        productName = this.specialCaseMappings[upperProductName];
      }
      
      // First try to get a static asset image based on the product name
      const staticImage = this.getStaticProductImage(productName);
      if (staticImage) {
        return staticImage;
      }
      
      const imageUrl = this.getProductImageUrl(category, productName);
      return imageUrl;
    } catch (error) {
      return this.getDefaultImageUrl();
    }
  }

  /**
   * Gets a default placeholder image URL
   * 
   * @returns URL to the default product image
   */
  getDefaultImageUrl(): string {
    return 'assets/default-product.jpg';
  }
  
  /**
   * Gets a static asset image based on product name
   * 
   * @param productName The product name
   * @returns URL to a static asset image or null if no match
   */
  getStaticProductImage(productName: string): string | null {
    if (!productName) return null;
    
    const lowerName = productName.toLowerCase();
    
    if (lowerName.includes('zafaran') || lowerName.includes('saffron')) {
      return 'assets/mee-tarik-saffron.png';
    } else if (lowerName.includes('minyak') || lowerName.includes('bidara')) {
      return 'assets/default-product.jpg';
    } else if (lowerName.includes('madu') || lowerName.includes('minda')) {
      return 'assets/default-product.jpg';
    } else if (lowerName.includes('tomyam')) {
      return 'assets/tomyam-odeen.png';
    } else if (lowerName.includes('perisa kari')) {
      return 'assets/perisa-kari.png';
    } else if (lowerName.includes('sup')) {
      return 'assets/sup.png';
    }
    
    return null;
  }
  
  /**
   * Uploads a product image to the server
   * 
   * @param file The image file to upload
   * @param category The product category
   * @param productName The product name
   * @returns An Observable that emits upload progress events
   */
  uploadProductImage(file: File, category: string, productName: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('productName', productName);
    
    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true
    });
    
    return this.http.request(req);
  }

  /**
   * Normalizes a category name to match directory structure
   */
  private normalizeCategory(category: string): string {
    // Handle capitalization variations
    category = category.trim();
    
    // Map common variations to the exact folder names
    const categoryMap: Record<string, string> = {
      'madu': 'Madu',
      'mee': 'Mee',
      'minuman': 'Minuman',
      'rempah': 'Rempah',
      'sos': 'Sos',
      'lain-lain': 'Lain-lain',
      'lain lain': 'Lain-lain'
    };
    
    return categoryMap[category.toLowerCase()] || category;
  }

  /**
   * Converts any image path format to the API URL format
   * Handles both old paths (assets/QurbaProductPhoto/...) and new API paths
   * 
   * @param imagePath The image path from database
   * @returns The API URL for the image
   */
  convertToApiUrl(imagePath: string): string {
    if (!imagePath) {
      return this.getDefaultImageUrl();
    }

    try {
      // If this is already an API path, use it directly
      if (imagePath.startsWith('/qurba/api/')) {
        return imagePath;
      }
      
      // If it's a full URL, use it as is
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // If it's a relative path to assets, convert it to an API path
      if (imagePath.includes('assets/QurbaProductPhoto/')) {
        // Extract the category and filename
        const match = imagePath.match(/assets\/QurbaProductPhoto\/([^\/]+)\/([^\/]+)$/);
        if (match) {
          const category = match[1];
          const filename = match[2];
          return `${environment.apiUrl}/images/product/${category}/${filename}`;
        }
      }
    
      // For other paths, return as is
      return imagePath;
    } catch (error) {
      console.error(`Error processing image path: ${imagePath}`, error);
      return this.getDefaultImageUrl();
    }
  }

  /**
   * Gets a safe URL for a direct image path
   * 
   * @param imagePath The direct image path
   * @returns A safe URL for the image
   */
  getSafeUrl(imagePath: string): string {
    return this.convertToApiUrl(imagePath);
  }

  /**
   * Gets a URL for a product image
   * 
   * @param imagePath The image path from the product
   * @returns The URL for the image
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return this.getDefaultImageUrl();
    }

    // If it's a full URL, use it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it's an API path, use it directly
    if (imagePath.startsWith('/qurba/api/')) {
      return imagePath;
    }

    // For relative paths, convert to API URL
    return `${environment.apiUrl}/images/${imagePath}`;
  }

  /**
   * Mark an image URL as failed to prevent repeated requests
   * 
   * @param url The URL that failed to load
   */
  markImageAsFailed(url: string): void {
    this.failedImageUrls.add(url);
  }
} 