import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  constructor(private router: Router) {}

  goToVouchers() {
    this.router.navigate(['/vouchers']);
  }
}
