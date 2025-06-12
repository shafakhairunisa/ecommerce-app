import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
      <p class="text-lg mb-4">Discover amazing products at great prices.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Featured products will be added here -->
      </div>
    </div>
  `
})
export class HomeComponent {} 