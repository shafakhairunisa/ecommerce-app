import { Component, Input, Output, EventEmitter, Inject, Optional, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Product } from '../../../core/models/product.model';
import { AdminService } from '../../../core/services/admin.service';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  @Input() productData?: Product;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  editMode = false;
  form: FormGroup;
  
  // Image upload properties
  selectedFile: File | null = null;
  selectedFileName: string = '';
  imagePreview: string | null = null;
  uploadProgress: number = 0;
  uploadError: string = '';
  uploadSuccess: string = '';
  
  // Available categories
  availableCategories: string[] = [
   'Lain-lain',
    'Madu',
    'Mee',
    'Minuman',
    'Rempah',
    'Sos'
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private imageService: ImageService,
    private http: HttpClient,
    @Optional() private dialogRef?: MatDialogRef<ProductFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Product
  ) {
    // Initialize form
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imagePath: ['']
    });
    
    // If data is provided via dialog, use it
    if (data) {
      this.productData = data;
    }
  }

  ngOnInit() {
    // If product data is provided, populate the form
    if (this.productData) {
      this.editMode = true;
      this.form.patchValue({
        name: this.productData.name,
        description: this.productData.description,
        price: this.productData.price,
        category: this.productData.category,
        stockQuantity: this.productData.stockQuantity,
        imagePath: this.productData.imagePath
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    
    // Get form values
    const formData = this.form.value;
    
    // If it's a new product and an image was selected, upload it
    if (!this.editMode && this.selectedFile) {
      this.uploadImage().then(success => {
        if (success) {
          // Add the image path to the form data
          formData.imagePath = `assets/images/products/${formData.category}/${formData.name}.${this.getFileExtension(this.selectedFile!.name)}`;
          
          // Submit the form
          this.submitForm(formData);
        }
      });
    } else {
      // If no image was selected or it's an edit, just submit the form
      this.submitForm(formData);
    }
  }

  submitForm(formData: any) {
    // Emit the form data
    this.formSubmit.emit(formData);
    
    // If in dialog mode, close the dialog
    if (this.dialogRef) {
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    // Emit cancel event
    this.cancelForm.emit();
    
    // If in dialog mode, close the dialog
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadImage(): Promise<boolean> {
    if (!this.selectedFile) {
      return true; // No file to upload, consider it a success
    }
    
    return new Promise<boolean>((resolve) => {
      // In a real application, you would upload the file to a server
      // For now, we'll simulate the upload with a timeout
      
      this.uploadProgress = 0;
      this.uploadError = '';
      this.uploadSuccess = '';
      
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.uploadSuccess = 'Image uploaded successfully!';
          resolve(true);
        }
      }, 300);
      
      // Simulate a potential error
      if (this.selectedFile && this.selectedFile.size > 5000000) { // 5MB
        clearInterval(interval);
        this.uploadError = 'File is too large. Maximum size is 5MB.';
        resolve(false);
      }
    });
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop() || 'png';
  }

  getProductImagePath(product: Product): string {
    if (!product.category || !product.name) {
      return this.imageService.getDefaultImageUrl();
    }
    
    if (product.imagePath) {
      return this.imageService.getSafeUrl(product.imagePath);
    }
    
    return this.imageService.getSafeProductImageUrl(product.category, product.name);
  }

  getExamplesForCategory(category: string): string[] {
    const guidelines = this.adminService.getProductImageGuidelines();
    const categoryGuideline = guidelines.find(g => g.category === category);
    return categoryGuideline ? categoryGuideline.examples : [];
  }
} 