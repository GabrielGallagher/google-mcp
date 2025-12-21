import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="flex flex-col items-center">
      <!-- Hero Section - Google Search Style -->
      <div class="w-full flex flex-col items-center pt-16 pb-8 px-4">
        <!-- Logo -->
        <div class="mb-8 animate-fade-in">
          <h1 class="text-6xl md:text-7xl font-normal tracking-tight">
            <span class="text-[var(--color-google-blue)]">G</span><span class="text-[var(--color-google-red)]">o</span><span class="text-[var(--color-google-yellow)]">o</span><span class="text-[var(--color-google-blue)]">g</span><span class="text-[var(--color-google-green)]">l</span><span class="text-[var(--color-google-red)]">e</span>
            <span class="text-[var(--color-google-gray-700)] font-light ml-2">MCP</span>
          </h1>
        </div>

        <!-- Search Box -->
        <div class="w-full max-w-xl mb-8 animate-fade-in" style="animation-delay: 0.1s">
          <div class="google-search-box flex items-center px-4 py-3 bg-white">
            <svg class="w-5 h-5 text-[var(--color-google-gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search documentation..." 
              class="flex-1 bg-transparent border-none outline-none px-4 text-base text-[var(--color-google-gray-900)]"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            >
            <button 
              class="p-2 hover:bg-[var(--color-google-gray-100)] rounded-full transition-colors"
              (click)="onSearch()"
            >
              <svg class="w-5 h-5 text-[var(--color-google-blue)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mb-12 animate-fade-in" style="animation-delay: 0.2s">
          <a routerLink="/getting-started" class="google-btn google-btn-secondary">
            Get Started
          </a>
          <a routerLink="/services" class="google-btn google-btn-secondary">
            View Services
          </a>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="w-full max-w-4xl px-4 mb-12 animate-fade-in" style="animation-delay: 0.3s">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4">
            <div class="text-3xl font-semibold text-[var(--color-google-blue)]">12</div>
            <div class="text-sm text-[var(--color-google-gray-600)]">Google Services</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-semibold text-[var(--color-google-red)]">100+</div>
            <div class="text-sm text-[var(--color-google-gray-600)]">MCP Tools</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-semibold text-[var(--color-google-yellow)]">OAuth</div>
            <div class="text-sm text-[var(--color-google-gray-600)]">Authentication</div>
          </div>
          <div class="text-center p-4">
            <div class="text-3xl font-semibold text-[var(--color-google-green)]">MIT</div>
            <div class="text-sm text-[var(--color-google-gray-600)]">License</div>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="w-full max-w-6xl px-4 mb-16">
        <h2 class="text-2xl font-normal text-[var(--color-google-gray-900)] mb-8 text-center animate-fade-in" style="animation-delay: 0.4s">
          Integrated Google Services
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (service of services(); track service.id; let i = $index) {
            <a 
              [routerLink]="['/services', service.id]" 
              class="google-card p-6 flex flex-col items-center text-center cursor-pointer animate-fade-in"
              [style.animation-delay]="(0.4 + i * 0.05) + 's'"
            >
              <div 
                class="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                [style.background-color]="service.bgColor"
              >
                <span class="text-2xl" [innerHTML]="service.icon"></span>
              </div>
              <h3 class="font-medium text-[var(--color-google-gray-900)] mb-1">{{ service.name }}</h3>
              <p class="text-xs text-[var(--color-google-gray-600)]">{{ service.description }}</p>
            </a>
          }
        </div>
      </div>

      <!-- Getting Started Section -->
      <div class="w-full bg-[var(--color-google-gray-50)] py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-normal text-[var(--color-google-gray-900)] mb-8 text-center">
            Quick Start
          </h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white google-card p-6">
              <div class="w-10 h-10 rounded-full bg-[var(--color-google-blue-light)] flex items-center justify-center mb-4">
                <span class="text-[var(--color-google-blue)] font-semibold">1</span>
              </div>
              <h3 class="font-medium text-[var(--color-google-gray-900)] mb-2">Install</h3>
              <div class="code-block p-3 text-xs overflow-x-auto">
                <code>pnpm add &#64;pegasusheavy/google-mcp</code>
              </div>
            </div>
            <div class="bg-white google-card p-6">
              <div class="w-10 h-10 rounded-full bg-[var(--color-google-blue-light)] flex items-center justify-center mb-4">
                <span class="text-[var(--color-google-blue)] font-semibold">2</span>
              </div>
              <h3 class="font-medium text-[var(--color-google-gray-900)] mb-2">Configure</h3>
              <p class="text-sm text-[var(--color-google-gray-600)]">Add to your MCP settings and place Google OAuth credentials</p>
            </div>
            <div class="bg-white google-card p-6">
              <div class="w-10 h-10 rounded-full bg-[var(--color-google-blue-light)] flex items-center justify-center mb-4">
                <span class="text-[var(--color-google-blue)] font-semibold">3</span>
              </div>
              <h3 class="font-medium text-[var(--color-google-gray-900)] mb-2">Authenticate</h3>
              <p class="text-sm text-[var(--color-google-gray-600)]">Run google_auth to connect your Google account</p>
            </div>
          </div>
          <div class="text-center mt-8">
            <a routerLink="/getting-started" class="google-btn google-btn-primary">
              View Full Guide
            </a>
          </div>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="w-full py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-2xl font-normal text-[var(--color-google-gray-900)] mb-4">
                Model Context Protocol
              </h2>
              <p class="text-[var(--color-google-gray-600)] mb-6">
                Google MCP provides a standardized way for AI assistants to interact with Google Workspace services. 
                Use natural language to manage your emails, calendar, documents, and more.
              </p>
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-[var(--color-google-gray-700)]">
                  <svg class="w-5 h-5 text-[var(--color-google-green)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Secure OAuth 2.0 authentication
                </li>
                <li class="flex items-center gap-3 text-[var(--color-google-gray-700)]">
                  <svg class="w-5 h-5 text-[var(--color-google-green)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  100+ tools across 12 services
                </li>
                <li class="flex items-center gap-3 text-[var(--color-google-gray-700)]">
                  <svg class="w-5 h-5 text-[var(--color-google-green)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  TypeScript with full type safety
                </li>
                <li class="flex items-center gap-3 text-[var(--color-google-gray-700)]">
                  <svg class="w-5 h-5 text-[var(--color-google-green)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Cross-platform support (Linux, macOS, Windows)
                </li>
              </ul>
            </div>
            <div class="bg-[var(--color-google-gray-900)] rounded-lg p-6 code-block">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-3 h-3 rounded-full bg-[var(--color-google-red)]"></div>
                <div class="w-3 h-3 rounded-full bg-[var(--color-google-yellow)]"></div>
                <div class="w-3 h-3 rounded-full bg-[var(--color-google-green)]"></div>
              </div>
              <pre class="text-sm overflow-x-auto"><code class="text-[#e8eaed]"><span class="text-[var(--color-google-gray-500)]">// MCP Configuration</span>
&#123;
  <span class="text-[#9cdcfe]">"mcpServers"</span>: &#123;
    <span class="text-[#9cdcfe]">"google"</span>: &#123;
      <span class="text-[#9cdcfe]">"command"</span>: <span class="text-[#ce9178]">"node"</span>,
      <span class="text-[#9cdcfe]">"args"</span>: [<span class="text-[#ce9178]">"google-mcp"</span>]
    &#125;
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Home {
  protected searchQuery = '';

  protected services = signal<Service[]>([
    { id: 'calendar', name: 'Calendar', description: 'Events & scheduling', icon: '📅', color: '#4285F4', bgColor: '#E8F0FE' },
    { id: 'gmail', name: 'Gmail', description: 'Email management', icon: '✉️', color: '#EA4335', bgColor: '#FCE8E6' },
    { id: 'drive', name: 'Drive', description: 'File storage', icon: '📁', color: '#FBBC05', bgColor: '#FEF7E0' },
    { id: 'docs', name: 'Docs', description: 'Documents', icon: '📄', color: '#4285F4', bgColor: '#E8F0FE' },
    { id: 'sheets', name: 'Sheets', description: 'Spreadsheets', icon: '📊', color: '#34A853', bgColor: '#E6F4EA' },
    { id: 'slides', name: 'Slides', description: 'Presentations', icon: '📽️', color: '#FBBC05', bgColor: '#FEF7E0' },
    { id: 'meet', name: 'Meet', description: 'Video meetings', icon: '🎥', color: '#34A853', bgColor: '#E6F4EA' },
    { id: 'chat', name: 'Chat', description: 'Team messaging', icon: '💬', color: '#34A853', bgColor: '#E6F4EA' },
    { id: 'forms', name: 'Forms', description: 'Surveys & forms', icon: '📝', color: '#673AB7', bgColor: '#EDE7F6' },
    { id: 'youtube', name: 'YouTube', description: 'Video platform', icon: '▶️', color: '#FF0000', bgColor: '#FFEBEE' },
    { id: 'tasks', name: 'Tasks', description: 'To-do lists', icon: '✅', color: '#4285F4', bgColor: '#E8F0FE' },
    { id: 'contacts', name: 'Contacts', description: 'People & contacts', icon: '👥', color: '#4285F4', bgColor: '#E8F0FE' },
  ]);

  constructor(private router: Router) {}

  protected onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}

