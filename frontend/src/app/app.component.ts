import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hideNavbar = false;
  mobileMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide navbar only on admin and customer pages
        this.hideNavbar = event.url.includes('/adminpage') || event.url.includes('/customer');
      }
    });
  }

    isCustomerPage(): boolean {
    const url = this.router.url;
    return url.includes('/customer') || 
           url.includes('/wishlist') || 
           url.includes('/cart') ||
           url.includes('/products');
  }

  ngOnInit() {
    // Check for fragment after navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.parseUrl(event.url).fragment;
        if (fragment) {
          this.scrollToSection(fragment);
        }
      }
    });
  }

  scrollToSection(sectionId: string) {
    // Close mobile menu when navigating
    this.mobileMenuOpen = false;

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}