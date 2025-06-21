import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Slide {
  image: string;
  alt: string;
}

interface BlogPost {
  id: number;
  image: string;
  title: string;
  description: string;
  fullContent: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  isResetting = false;
  selectedBlog: BlogPost | null = null;
  showModal = false;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  slides: Slide[] = [
    { image: 'herosection1.png', alt: 'Hero Section 1' },
    { image: 'herosection2.png', alt: 'Hero Section 2' },
    { image: 'herosection3.png', alt: 'Hero Section 3' },
    { image: 'herosection4.png', alt: 'Hero Section 4' },
    { image: 'perisa-kari.png', alt: 'Perisa Kari' },
    { image: 'sup.png', alt: 'Sup' },
    { image: 'tomyam-odeen.png', alt: 'Tomyam Odeen' }
  ];

  blogPosts: BlogPost[] = [
    {
      id: 1,
      image: 'blog.png',
      title: 'Mee Tarik Saffron: A Journey of Flavors',
      description: 'Discover the unique blend of kurma and kismis in our signature Mee Tarik Saffron, creating a perfect harmony of sweet and savory.',
      fullContent: 'Our Mee Tarik Saffron represents the pinnacle of noodle craftsmanship, combining traditional techniques with premium ingredients. The addition of kurma (dates) and kismis (raisins) brings a subtle sweetness that complements the rich saffron flavor. Made without any artificial preservatives or benzoyl peroxide, our noodles maintain their authentic texture and taste while ensuring the highest food safety standards.'
    },
    {
      id: 2,
      image: 'blog2.png',
      title: 'Exploring Our Product Range',
      description: 'Take a tour through our diverse collection of halal-certified products, from instant noodles to cooking essentials.',
      fullContent: 'At Qurba Food Industries, we take pride in our comprehensive range of halal-certified products. Each item in our collection is carefully crafted to meet the highest standards of quality and taste. From our signature Mee Tarik Saffron to our specialized cooking ingredients, every product reflects our commitment to excellence and our respect for traditional flavors. Our manufacturing process combines modern technology with time-honored recipes, ensuring that each product delivers consistent quality and authentic taste.'
    }
  ];

  private autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngAfterViewInit() {
    // Handle fragment navigation
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  openBlogModal(blog: BlogPost) {
    this.selectedBlog = blog;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBlog = null;
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    if (this.currentSlide === this.slides.length - 1) {
      this.isResetting = true;
      this.currentSlide = 0;
      setTimeout(() => {
        this.isResetting = false;
      }, 50);
    } else {
      this.currentSlide++;
    }
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  onSlideClick() {
    this.router.navigate(['/login']);
  }
} 