import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/product-list'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
    }
  }
}
