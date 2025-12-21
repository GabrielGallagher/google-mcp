import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarDays, faEnvelope, faFolder, faFileLines, faTableCells,
  faDisplay, faVideo, faComments, faClipboardQuestion, faListCheck, faAddressBook, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  icon: IconDefinition;
  color: string;
  bgColor: string;
  fullDescription: string;
  tools: ToolInfo[];
  examples: ExampleInfo[];
  scopes: string[];
}

interface ToolInfo {
  name: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
}

interface ExampleInfo {
  title: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-service-detail',
  imports: [RouterLink, FontAwesomeModule],
  template: `
    @if (service()) {
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-8">
          <a routerLink="/" class="text-[var(--color-google-blue)] hover:underline">Home</a>
          <span class="text-[var(--color-google-gray-400)]">/</span>
          <a routerLink="/services" class="text-[var(--color-google-blue)] hover:underline">Services</a>
          <span class="text-[var(--color-google-gray-400)]">/</span>
          <span class="text-[var(--color-google-gray-600)]">{{ service()!.name }}</span>
        </nav>

        <!-- Header -->
        <div class="flex items-start gap-6 mb-12">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            [style.background-color]="service()!.bgColor"
          >
            <fa-icon [icon]="service()!.icon" class="text-4xl" [style.color]="service()!.color"></fa-icon>
          </div>
          <div>
            <h1 class="text-3xl font-normal text-[var(--color-google-gray-900)] mb-2">{{ service()!.name }}</h1>
            <p class="text-lg text-[var(--color-google-gray-600)]">{{ service()!.description }}</p>
          </div>
        </div>

        <!-- Overview -->
        <section class="mb-12">
          <h2 class="text-xl font-medium text-[var(--color-google-gray-900)] mb-4">Overview</h2>
          <div class="google-card p-6">
            <p class="text-[var(--color-google-gray-700)] leading-relaxed">{{ service()!.fullDescription }}</p>
          </div>
        </section>

        <!-- Required Scopes -->
        <section class="mb-12">
          <h2 class="text-xl font-medium text-[var(--color-google-gray-900)] mb-4">OAuth Scopes</h2>
          <div class="google-card p-6">
            <p class="text-sm text-[var(--color-google-gray-600)] mb-4">This service requires the following OAuth scopes:</p>
            <div class="space-y-2">
              @for (scope of service()!.scopes; track scope) {
                <code class="block text-xs bg-[var(--color-google-gray-100)] px-3 py-2 rounded text-[var(--color-google-gray-700)] overflow-x-auto">
                  {{ scope }}
                </code>
              }
            </div>
          </div>
        </section>

        <!-- Tools -->
        <section class="mb-12">
          <h2 class="text-xl font-medium text-[var(--color-google-gray-900)] mb-4">
            Available Tools
            <span class="text-sm font-normal text-[var(--color-google-gray-500)] ml-2">({{ service()!.tools.length }})</span>
          </h2>
          <div class="space-y-4">
            @for (tool of service()!.tools; track tool.name) {
              <div class="google-card p-6">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <code class="text-sm font-medium text-[var(--color-google-blue)] bg-[var(--color-google-blue-light)] px-3 py-1 rounded">
                    {{ tool.name }}
                  </code>
                </div>
                <p class="text-[var(--color-google-gray-700)] mb-4">{{ tool.description }}</p>

                @if (tool.parameters && tool.parameters.length > 0) {
                  <div class="border-t border-[var(--color-google-gray-100)] pt-4">
                    <h4 class="text-sm font-medium text-[var(--color-google-gray-700)] mb-3">Parameters</h4>
                    <div class="overflow-x-auto">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="text-left text-[var(--color-google-gray-600)]">
                            <th class="pb-2 pr-4 font-medium">Name</th>
                            <th class="pb-2 pr-4 font-medium">Type</th>
                            <th class="pb-2 pr-4 font-medium">Required</th>
                            <th class="pb-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody class="text-[var(--color-google-gray-700)]">
                          @for (param of tool.parameters; track param.name) {
                            <tr class="border-t border-[var(--color-google-gray-100)]">
                              <td class="py-2 pr-4">
                                <code class="text-xs bg-[var(--color-google-gray-100)] px-2 py-0.5 rounded">{{ param.name }}</code>
                              </td>
                              <td class="py-2 pr-4 text-xs text-[var(--color-google-gray-500)]">{{ param.type }}</td>
                              <td class="py-2 pr-4">
                                @if (param.required) {
                                  <span class="text-xs px-2 py-0.5 bg-[var(--color-google-red)] text-white rounded">Yes</span>
                                } @else {
                                  <span class="text-xs px-2 py-0.5 bg-[var(--color-google-gray-200)] text-[var(--color-google-gray-600)] rounded">No</span>
                                }
                              </td>
                              <td class="py-2 text-xs">{{ param.description }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </section>

        <!-- Examples -->
        @if (service()!.examples.length > 0) {
          <section class="mb-12">
            <h2 class="text-xl font-medium text-[var(--color-google-gray-900)] mb-4">Examples</h2>
            <div class="space-y-6">
              @for (example of service()!.examples; track example.title) {
                <div class="google-card p-6">
                  <h3 class="font-medium text-[var(--color-google-gray-900)] mb-2">{{ example.title }}</h3>
                  <p class="text-sm text-[var(--color-google-gray-600)] mb-4">{{ example.description }}</p>
                  <div class="code-block p-4">
                    <pre class="text-sm overflow-x-auto"><code>{{ example.code }}</code></pre>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Navigation -->
        <div class="flex justify-between items-center pt-8 border-t border-[var(--color-google-gray-200)]">
          <a routerLink="/services" class="google-btn google-btn-secondary">
            ← All Services
          </a>
          <a routerLink="/tools" class="google-btn google-btn-primary">
            View All Tools →
          </a>
        </div>
      </div>
    } @else {
      <div class="max-w-4xl mx-auto px-4 py-24 text-center">
        <fa-icon [icon]="faSearch" class="text-6xl text-[var(--color-google-gray-400)] mb-4"></fa-icon>
        <h2 class="text-xl font-medium text-[var(--color-google-gray-700)] mb-2">Service not found</h2>
        <p class="text-[var(--color-google-gray-500)] mb-6">The requested service doesn't exist.</p>
        <a routerLink="/services" class="google-btn google-btn-primary">View All Services</a>
      </div>
    }
  `,
})
export class ServiceDetail implements OnInit {
  private route = inject(ActivatedRoute);

  // Font Awesome icons
  protected readonly faSearch = faSearch;

  protected serviceId = signal<string>('');
  protected service = computed(() => this.servicesData[this.serviceId()]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.serviceId.set(params.get('id') || '');
    });
  }

  private servicesData: Record<string, ServiceInfo> = {
    calendar: {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Manage events, meetings, and schedules',
      icon: faCalendarDays,
      color: '#4285F4',
      bgColor: '#E8F0FE',
      fullDescription: 'Google Calendar integration allows you to create, read, update, and delete calendar events. You can manage multiple calendars, check availability with free/busy queries, and use natural language to quickly add events.',
      scopes: ['https://www.googleapis.com/auth/calendar'],
      tools: [
        { name: 'calendar_list', description: 'List all calendars accessible by the user', parameters: [] },
        { name: 'calendar_get', description: 'Get details of a specific calendar', parameters: [{ name: 'calendarId', type: 'string', required: true, description: 'Calendar ID (use "primary" for main calendar)' }] },
        { name: 'calendar_list_events', description: 'List events from a calendar', parameters: [
          { name: 'calendarId', type: 'string', required: false, description: 'Calendar ID (default: primary)' },
          { name: 'timeMin', type: 'string', required: false, description: 'Start time (ISO 8601)' },
          { name: 'timeMax', type: 'string', required: false, description: 'End time (ISO 8601)' },
          { name: 'maxResults', type: 'number', required: false, description: 'Max events to return' }
        ]},
        { name: 'calendar_create_event', description: 'Create a new calendar event', parameters: [
          { name: 'summary', type: 'string', required: true, description: 'Event title' },
          { name: 'start', type: 'object', required: true, description: 'Start time with dateTime or date' },
          { name: 'end', type: 'object', required: true, description: 'End time with dateTime or date' },
          { name: 'attendees', type: 'string[]', required: false, description: 'List of attendee emails' },
          { name: 'description', type: 'string', required: false, description: 'Event description' },
          { name: 'location', type: 'string', required: false, description: 'Event location' }
        ]},
        { name: 'calendar_update_event', description: 'Update an existing event', parameters: [
          { name: 'eventId', type: 'string', required: true, description: 'Event ID to update' },
          { name: 'calendarId', type: 'string', required: false, description: 'Calendar ID' }
        ]},
        { name: 'calendar_delete_event', description: 'Delete a calendar event', parameters: [
          { name: 'eventId', type: 'string', required: true, description: 'Event ID to delete' },
          { name: 'calendarId', type: 'string', required: false, description: 'Calendar ID' }
        ]},
        { name: 'calendar_quick_add', description: 'Add event using natural language', parameters: [
          { name: 'text', type: 'string', required: true, description: 'Natural language event description' },
          { name: 'calendarId', type: 'string', required: false, description: 'Calendar ID' }
        ]},
        { name: 'calendar_get_freebusy', description: 'Check availability for calendars', parameters: [
          { name: 'timeMin', type: 'string', required: true, description: 'Start time' },
          { name: 'timeMax', type: 'string', required: true, description: 'End time' },
          { name: 'calendarIds', type: 'string[]', required: false, description: 'Calendar IDs to check' }
        ]},
        { name: 'calendar_today', description: 'Get all events for today', parameters: [{ name: 'calendarId', type: 'string', required: false, description: 'Calendar ID' }] },
        { name: 'calendar_upcoming', description: 'Get upcoming events', parameters: [
          { name: 'days', type: 'number', required: false, description: 'Days ahead (default: 7)' },
          { name: 'calendarId', type: 'string', required: false, description: 'Calendar ID' }
        ]}
      ],
      examples: [
        { title: 'Schedule a meeting', description: 'Create a team meeting with attendees', code: 'Use calendar_create_event with summary "Team Meeting", start "2024-12-25T10:00:00-05:00", end "2024-12-25T11:00:00-05:00", attendees ["alice@example.com", "bob@example.com"]' },
        { title: 'Quick add event', description: 'Add event using natural language', code: 'Use calendar_quick_add with text "Lunch with John tomorrow at noon at Cafe Blue"' },
        { title: "Get today's schedule", description: "See all events for today", code: 'Use calendar_today' }
      ]
    },
    gmail: {
      id: 'gmail',
      name: 'Gmail',
      description: 'Read, send, and organize emails',
      icon: faEnvelope,
      color: '#EA4335',
      bgColor: '#FCE8E6',
      fullDescription: 'Gmail integration provides comprehensive email management including reading, sending, replying, searching, and organizing messages. You can work with threads, labels, and perform bulk operations.',
      scopes: ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send'],
      tools: [
        { name: 'gmail_get_profile', description: 'Get Gmail profile information', parameters: [] },
        { name: 'gmail_list_labels', description: 'List all Gmail labels', parameters: [] },
        { name: 'gmail_list_messages', description: 'List emails with optional filters', parameters: [
          { name: 'maxResults', type: 'number', required: false, description: 'Max messages to return' },
          { name: 'labelIds', type: 'string[]', required: false, description: 'Filter by labels' },
          { name: 'query', type: 'string', required: false, description: 'Gmail search query' }
        ]},
        { name: 'gmail_get_message', description: 'Get a specific email', parameters: [{ name: 'messageId', type: 'string', required: true, description: 'Message ID' }] },
        { name: 'gmail_send', description: 'Send an email', parameters: [
          { name: 'to', type: 'string', required: true, description: 'Recipient email' },
          { name: 'subject', type: 'string', required: true, description: 'Email subject' },
          { name: 'body', type: 'string', required: true, description: 'Email body' },
          { name: 'cc', type: 'string', required: false, description: 'CC recipients' },
          { name: 'bcc', type: 'string', required: false, description: 'BCC recipients' }
        ]},
        { name: 'gmail_search', description: 'Search emails', parameters: [{ name: 'query', type: 'string', required: true, description: 'Search query' }] },
        { name: 'gmail_get_unread', description: 'Get unread emails', parameters: [] },
        { name: 'gmail_mark_read', description: 'Mark email as read', parameters: [{ name: 'messageId', type: 'string', required: true, description: 'Message ID' }] }
      ],
      examples: [
        { title: 'Send an email', description: 'Send a simple email', code: 'Use gmail_send with to "recipient@example.com", subject "Hello", body "This is my message."' },
        { title: 'Search emails', description: 'Find emails from a specific sender', code: 'Use gmail_search with query "from:boss@company.com subject:urgent"' }
      ]
    },
    drive: {
      id: 'drive',
      name: 'Google Drive',
      description: 'Store, search, and manage files',
      icon: faFolder,
      color: '#FBBC05',
      bgColor: '#FEF7E0',
      fullDescription: 'Google Drive integration enables file management operations including listing, uploading, downloading, searching, and organizing files. You can work with folders, share files, and export Google Workspace documents.',
      scopes: ['https://www.googleapis.com/auth/drive'],
      tools: [
        { name: 'drive_list_files', description: 'List files in Drive', parameters: [
          { name: 'pageSize', type: 'number', required: false, description: 'Max files to return' },
          { name: 'folderId', type: 'string', required: false, description: 'Filter by folder' },
          { name: 'query', type: 'string', required: false, description: 'Search query' }
        ]},
        { name: 'drive_get_file', description: 'Get file metadata', parameters: [{ name: 'fileId', type: 'string', required: true, description: 'File ID' }] },
        { name: 'drive_download_file', description: 'Download file content', parameters: [{ name: 'fileId', type: 'string', required: true, description: 'File ID' }] },
        { name: 'drive_upload_file', description: 'Upload a file', parameters: [
          { name: 'name', type: 'string', required: true, description: 'File name' },
          { name: 'content', type: 'string', required: true, description: 'File content' },
          { name: 'mimeType', type: 'string', required: false, description: 'MIME type' },
          { name: 'folderId', type: 'string', required: false, description: 'Parent folder ID' }
        ]},
        { name: 'drive_create_folder', description: 'Create a folder', parameters: [
          { name: 'name', type: 'string', required: true, description: 'Folder name' },
          { name: 'parentId', type: 'string', required: false, description: 'Parent folder ID' }
        ]},
        { name: 'drive_search', description: 'Search files', parameters: [{ name: 'query', type: 'string', required: true, description: 'Search query' }] },
        { name: 'drive_delete_file', description: 'Delete a file', parameters: [{ name: 'fileId', type: 'string', required: true, description: 'File ID' }] }
      ],
      examples: [
        { title: 'Search for documents', description: 'Find all PDFs', code: 'Use drive_search with query "quarterly report"' },
        { title: 'Create a folder', description: 'Create a new project folder', code: 'Use drive_create_folder with name "Project Alpha"' }
      ]
    },
    docs: {
      id: 'docs',
      name: 'Google Docs',
      description: 'Create and edit documents',
      icon: faFileLines,
      color: '#4285F4',
      bgColor: '#E8F0FE',
      fullDescription: 'Google Docs integration allows you to create, read, and modify documents. You can insert text, append content, and perform find-and-replace operations.',
      scopes: ['https://www.googleapis.com/auth/documents'],
      tools: [
        { name: 'docs_create', description: 'Create a new document', parameters: [
          { name: 'title', type: 'string', required: true, description: 'Document title' },
          { name: 'content', type: 'string', required: false, description: 'Initial content' }
        ]},
        { name: 'docs_read', description: 'Read document content', parameters: [{ name: 'documentId', type: 'string', required: true, description: 'Document ID' }] },
        { name: 'docs_insert_text', description: 'Insert text at position', parameters: [
          { name: 'documentId', type: 'string', required: true, description: 'Document ID' },
          { name: 'text', type: 'string', required: true, description: 'Text to insert' },
          { name: 'index', type: 'number', required: true, description: 'Position index' }
        ]},
        { name: 'docs_append_text', description: 'Append text to document', parameters: [
          { name: 'documentId', type: 'string', required: true, description: 'Document ID' },
          { name: 'text', type: 'string', required: true, description: 'Text to append' }
        ]},
        { name: 'docs_replace_text', description: 'Find and replace text', parameters: [
          { name: 'documentId', type: 'string', required: true, description: 'Document ID' },
          { name: 'find', type: 'string', required: true, description: 'Text to find' },
          { name: 'replace', type: 'string', required: true, description: 'Replacement text' }
        ]},
        { name: 'docs_list', description: 'List all documents', parameters: [] }
      ],
      examples: [
        { title: 'Create meeting notes', description: 'Create a new document with content', code: 'Use docs_create with title "Meeting Notes" and content "# Weekly Standup\\n\\nAttendees:\\n- Alice\\n- Bob"' }
      ]
    },
    sheets: {
      id: 'sheets',
      name: 'Google Sheets',
      description: 'Work with spreadsheets and data',
      icon: faTableCells,
      color: '#34A853',
      bgColor: '#E6F4EA',
      fullDescription: 'Google Sheets integration provides spreadsheet management including reading and writing cell values, managing sheets, and performing batch operations.',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      tools: [
        { name: 'sheets_create', description: 'Create a spreadsheet', parameters: [{ name: 'title', type: 'string', required: true, description: 'Spreadsheet title' }] },
        { name: 'sheets_get', description: 'Get spreadsheet info', parameters: [{ name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' }] },
        { name: 'sheets_read', description: 'Read values from range', parameters: [
          { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
          { name: 'range', type: 'string', required: true, description: 'Range (e.g., Sheet1!A1:D10)' }
        ]},
        { name: 'sheets_update', description: 'Update values in range', parameters: [
          { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
          { name: 'range', type: 'string', required: true, description: 'Range to update' },
          { name: 'values', type: 'any[][]', required: true, description: '2D array of values' }
        ]},
        { name: 'sheets_append', description: 'Append rows', parameters: [
          { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
          { name: 'range', type: 'string', required: true, description: 'Range to append to' },
          { name: 'values', type: 'any[][]', required: true, description: '2D array of values' }
        ]},
        { name: 'sheets_clear', description: 'Clear a range', parameters: [
          { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
          { name: 'range', type: 'string', required: true, description: 'Range to clear' }
        ]},
        { name: 'sheets_list', description: 'List spreadsheets', parameters: [] }
      ],
      examples: [
        { title: 'Read data', description: 'Read a range of cells', code: 'Use sheets_read with spreadsheetId "abc123" and range "Sheet1!A1:D10"' }
      ]
    },
    slides: {
      id: 'slides',
      name: 'Google Slides',
      description: 'Build and modify presentations',
      icon: faDisplay,
      color: '#FBBC05',
      bgColor: '#FEF7E0',
      fullDescription: 'Google Slides integration allows you to create and modify presentations, add slides, insert text and images, and perform text replacements.',
      scopes: ['https://www.googleapis.com/auth/presentations'],
      tools: [
        { name: 'slides_create', description: 'Create presentation', parameters: [{ name: 'title', type: 'string', required: true, description: 'Presentation title' }] },
        { name: 'slides_get', description: 'Get presentation', parameters: [{ name: 'presentationId', type: 'string', required: true, description: 'Presentation ID' }] },
        { name: 'slides_add_slide', description: 'Add a slide', parameters: [
          { name: 'presentationId', type: 'string', required: true, description: 'Presentation ID' },
          { name: 'layoutType', type: 'string', required: false, description: 'Layout type' }
        ]},
        { name: 'slides_add_text', description: 'Add text box', parameters: [
          { name: 'presentationId', type: 'string', required: true, description: 'Presentation ID' },
          { name: 'slideObjectId', type: 'string', required: true, description: 'Slide ID' },
          { name: 'text', type: 'string', required: true, description: 'Text content' }
        ]},
        { name: 'slides_add_image', description: 'Add image', parameters: [
          { name: 'presentationId', type: 'string', required: true, description: 'Presentation ID' },
          { name: 'slideObjectId', type: 'string', required: true, description: 'Slide ID' },
          { name: 'imageUrl', type: 'string', required: true, description: 'Image URL' }
        ]},
        { name: 'slides_list', description: 'List presentations', parameters: [] }
      ],
      examples: []
    },
    meet: {
      id: 'meet',
      name: 'Google Meet',
      description: 'Schedule and manage video meetings',
      icon: faVideo,
      color: '#34A853',
      bgColor: '#E6F4EA',
      fullDescription: 'Google Meet integration enables you to create meeting spaces, schedule meetings through Calendar, manage participants, and access recordings and transcripts.',
      scopes: ['https://www.googleapis.com/auth/meetings.space.created', 'https://www.googleapis.com/auth/meetings.space.readonly'],
      tools: [
        { name: 'meet_create_space', description: 'Create meeting space', parameters: [{ name: 'accessType', type: 'string', required: false, description: 'OPEN, TRUSTED, or RESTRICTED' }] },
        { name: 'meet_schedule', description: 'Schedule a meeting', parameters: [
          { name: 'summary', type: 'string', required: true, description: 'Meeting title' },
          { name: 'startTime', type: 'string', required: true, description: 'Start time (ISO 8601)' },
          { name: 'endTime', type: 'string', required: true, description: 'End time (ISO 8601)' },
          { name: 'attendees', type: 'string[]', required: false, description: 'Attendee emails' }
        ]},
        { name: 'meet_create_instant', description: 'Create instant meeting', parameters: [] },
        { name: 'meet_list_upcoming', description: 'List upcoming meetings', parameters: [{ name: 'days', type: 'number', required: false, description: 'Days ahead' }] },
        { name: 'meet_list_recordings', description: 'List recordings', parameters: [{ name: 'conferenceRecordName', type: 'string', required: true, description: 'Conference record name' }] },
        { name: 'meet_list_transcripts', description: 'List transcripts', parameters: [{ name: 'conferenceRecordName', type: 'string', required: true, description: 'Conference record name' }] }
      ],
      examples: [
        { title: 'Schedule a meeting', description: 'Schedule a team call', code: 'Use meet_schedule with summary "Team Standup", startTime "2024-12-25T09:00:00-05:00", endTime "2024-12-25T09:30:00-05:00"' }
      ]
    },
    chat: {
      id: 'chat',
      name: 'Google Chat',
      description: 'Send messages and manage spaces',
      icon: faComments,
      color: '#34A853',
      bgColor: '#E6F4EA',
      fullDescription: 'Google Chat integration allows you to send and manage messages, create and manage spaces, handle members, and add reactions.',
      scopes: ['https://www.googleapis.com/auth/chat.spaces', 'https://www.googleapis.com/auth/chat.messages'],
      tools: [
        { name: 'chat_list_spaces', description: 'List Chat spaces', parameters: [] },
        { name: 'chat_create_space', description: 'Create a space', parameters: [
          { name: 'displayName', type: 'string', required: true, description: 'Space name' },
          { name: 'spaceType', type: 'string', required: false, description: 'SPACE, GROUP_CHAT, or DIRECT_MESSAGE' }
        ]},
        { name: 'chat_send_message', description: 'Send a message', parameters: [
          { name: 'spaceName', type: 'string', required: true, description: 'Space resource name' },
          { name: 'text', type: 'string', required: true, description: 'Message text' }
        ]},
        { name: 'chat_list_members', description: 'List space members', parameters: [{ name: 'spaceName', type: 'string', required: true, description: 'Space name' }] },
        { name: 'chat_add_reaction', description: 'Add emoji reaction', parameters: [
          { name: 'messageName', type: 'string', required: true, description: 'Message name' },
          { name: 'emoji', type: 'string', required: true, description: 'Unicode emoji' }
        ]}
      ],
      examples: [
        { title: 'Send a message', description: 'Send message to a space', code: 'Use chat_send_message with spaceName "spaces/AAAAA" and text "Hello team!"' }
      ]
    },
    forms: {
      id: 'forms',
      name: 'Google Forms',
      description: 'Create surveys and collect responses',
      icon: faClipboardQuestion,
      color: '#673AB7',
      bgColor: '#EDE7F6',
      fullDescription: 'Google Forms integration enables you to create forms, add various question types, manage form structure, and retrieve responses.',
      scopes: ['https://www.googleapis.com/auth/forms.body', 'https://www.googleapis.com/auth/forms.responses.readonly'],
      tools: [
        { name: 'forms_create', description: 'Create a form', parameters: [
          { name: 'title', type: 'string', required: true, description: 'Form title' },
          { name: 'description', type: 'string', required: false, description: 'Form description' }
        ]},
        { name: 'forms_add_question', description: 'Add a question', parameters: [
          { name: 'formId', type: 'string', required: true, description: 'Form ID' },
          { name: 'title', type: 'string', required: true, description: 'Question title' },
          { name: 'questionType', type: 'string', required: true, description: 'Type: short_answer, paragraph, multiple_choice, etc.' },
          { name: 'options', type: 'string[]', required: false, description: 'Options for choice questions' }
        ]},
        { name: 'forms_list_responses', description: 'List responses', parameters: [{ name: 'formId', type: 'string', required: true, description: 'Form ID' }] },
        { name: 'forms_get_response', description: 'Get a response', parameters: [
          { name: 'formId', type: 'string', required: true, description: 'Form ID' },
          { name: 'responseId', type: 'string', required: true, description: 'Response ID' }
        ]}
      ],
      examples: [
        { title: 'Create a survey', description: 'Create a customer feedback form', code: 'Use forms_create with title "Customer Feedback" and description "Help us improve our service"' }
      ]
    },
    youtube: {
      id: 'youtube',
      name: 'YouTube',
      description: 'Search videos and manage playlists',
      icon: faYoutube,
      color: '#FF0000',
      bgColor: '#FFEBEE',
      fullDescription: 'YouTube integration allows you to search for videos, channels, and playlists, manage your own playlists, view comments, and interact with content through likes.',
      scopes: ['https://www.googleapis.com/auth/youtube'],
      tools: [
        { name: 'youtube_search', description: 'Search YouTube', parameters: [
          { name: 'query', type: 'string', required: true, description: 'Search query' },
          { name: 'type', type: 'string', required: false, description: 'video, channel, or playlist' },
          { name: 'maxResults', type: 'number', required: false, description: 'Max results' }
        ]},
        { name: 'youtube_get_video', description: 'Get video details', parameters: [{ name: 'videoId', type: 'string', required: true, description: 'Video ID' }] },
        { name: 'youtube_get_channel', description: 'Get channel details', parameters: [{ name: 'channelId', type: 'string', required: true, description: 'Channel ID' }] },
        { name: 'youtube_list_playlists', description: 'List your playlists', parameters: [] },
        { name: 'youtube_get_video_comments', description: 'Get comments', parameters: [{ name: 'videoId', type: 'string', required: true, description: 'Video ID' }] },
        { name: 'youtube_rate_video', description: 'Like/dislike video', parameters: [
          { name: 'videoId', type: 'string', required: true, description: 'Video ID' },
          { name: 'rating', type: 'string', required: true, description: 'like, dislike, or none' }
        ]}
      ],
      examples: [
        { title: 'Search videos', description: 'Find tutorial videos', code: 'Use youtube_search with query "typescript tutorial" and type "video"' }
      ]
    },
    tasks: {
      id: 'tasks',
      name: 'Google Tasks',
      description: 'Manage to-do lists and tasks',
      icon: faListCheck,
      color: '#4285F4',
      bgColor: '#E8F0FE',
      fullDescription: 'Google Tasks integration provides task management including task lists, creating and completing tasks, and note-taking functionality similar to Google Keep.',
      scopes: ['https://www.googleapis.com/auth/tasks'],
      tools: [
        { name: 'tasks_list_tasklists', description: 'List task lists', parameters: [] },
        { name: 'tasks_create_tasklist', description: 'Create task list', parameters: [{ name: 'title', type: 'string', required: true, description: 'List title' }] },
        { name: 'tasks_list_tasks', description: 'List tasks', parameters: [{ name: 'tasklistId', type: 'string', required: true, description: 'Task list ID' }] },
        { name: 'tasks_create_task', description: 'Create task', parameters: [
          { name: 'tasklistId', type: 'string', required: true, description: 'Task list ID' },
          { name: 'title', type: 'string', required: true, description: 'Task title' },
          { name: 'notes', type: 'string', required: false, description: 'Task notes' },
          { name: 'due', type: 'string', required: false, description: 'Due date' }
        ]},
        { name: 'tasks_complete_task', description: 'Complete task', parameters: [
          { name: 'tasklistId', type: 'string', required: true, description: 'Task list ID' },
          { name: 'taskId', type: 'string', required: true, description: 'Task ID' }
        ]},
        { name: 'notes_create', description: 'Create a note (Keep-like)', parameters: [
          { name: 'title', type: 'string', required: true, description: 'Note title' },
          { name: 'content', type: 'string', required: true, description: 'Note content' }
        ]},
        { name: 'notes_list', description: 'List notes', parameters: [] }
      ],
      examples: [
        { title: 'Create a shopping list', description: 'Create a note for shopping', code: 'Use notes_create with title "Shopping List" and content "- Milk\\n- Eggs\\n- Bread"' }
      ]
    },
    contacts: {
      id: 'contacts',
      name: 'Google Contacts',
      description: 'Manage contacts and contact groups',
      icon: faAddressBook,
      color: '#4285F4',
      bgColor: '#E8F0FE',
      fullDescription: 'Google Contacts (People API) integration allows you to list, search, create, and manage contacts and contact groups.',
      scopes: ['https://www.googleapis.com/auth/contacts'],
      tools: [
        { name: 'contacts_list', description: 'List contacts', parameters: [{ name: 'pageSize', type: 'number', required: false, description: 'Max contacts to return' }] },
        { name: 'contacts_get', description: 'Get contact details', parameters: [{ name: 'resourceName', type: 'string', required: true, description: 'Contact resource name' }] },
        { name: 'contacts_search', description: 'Search contacts', parameters: [{ name: 'query', type: 'string', required: true, description: 'Search query' }] },
        { name: 'contacts_create', description: 'Create contact', parameters: [
          { name: 'givenName', type: 'string', required: true, description: 'First name' },
          { name: 'familyName', type: 'string', required: false, description: 'Last name' },
          { name: 'email', type: 'string', required: false, description: 'Email address' },
          { name: 'phone', type: 'string', required: false, description: 'Phone number' }
        ]},
        { name: 'contacts_delete', description: 'Delete contact', parameters: [{ name: 'resourceName', type: 'string', required: true, description: 'Contact resource name' }] },
        { name: 'contacts_list_groups', description: 'List contact groups', parameters: [] }
      ],
      examples: [
        { title: 'Search contacts', description: 'Find a contact by name', code: 'Use contacts_search with query "John"' }
      ]
    }
  };
}

