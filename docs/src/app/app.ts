import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faBars, faXmark, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Font Awesome icons
  protected readonly faSearch = faSearch;
  protected readonly faBars = faBars;
  protected readonly faXmark = faXmark;
  protected readonly faGithub = faGithub;
  protected readonly faArrowRight = faArrowRight;
  protected readonly mobileMenuOpen = signal(false);
  protected searchQuery = '';

  constructor(private router: Router) {}

  protected isHomePage = computed(() => {
    return this.router.url === '/' || this.router.url === '';
  });

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  protected onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
