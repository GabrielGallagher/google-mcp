import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  tools: string[];
  features: string[];
}

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8">
        <a routerLink="/" class="text-[var(--color-google-blue)] hover:underline">Home</a>
        <span class="text-[var(--color-google-gray-400)]">/</span>
        <span class="text-[var(--color-google-gray-600)]">Services</span>
      </nav>

      <h1 class="text-3xl font-normal text-[var(--color-google-gray-900)] mb-4">Google Services</h1>
      <p class="text-lg text-[var(--color-google-gray-600)] mb-12">
        Google MCP provides comprehensive access to 12 Google Workspace and Google Cloud services.
      </p>

      <!-- Services Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (service of services(); track service.id) {
          <a [routerLink]="['/services', service.id]" class="google-card p-6 block">
            <div class="flex items-start gap-4">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                [style.background-color]="service.bgColor"
              >
                <span class="text-2xl">{{ service.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-[var(--color-google-gray-900)] mb-1">{{ service.name }}</h3>
                <p class="text-sm text-[var(--color-google-gray-600)] mb-3">{{ service.description }}</p>
                <div class="flex items-center gap-4 text-xs text-[var(--color-google-gray-500)]">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                    {{ service.tools.length }} tools
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Features preview -->
            <div class="mt-4 pt-4 border-t border-[var(--color-google-gray-100)]">
              <div class="flex flex-wrap gap-2">
                @for (feature of service.features.slice(0, 3); track feature) {
                  <span class="px-2 py-1 text-xs rounded-full bg-[var(--color-google-gray-100)] text-[var(--color-google-gray-600)]">
                    {{ feature }}
                  </span>
                }
                @if (service.features.length > 3) {
                  <span class="px-2 py-1 text-xs text-[var(--color-google-gray-500)]">
                    +{{ service.features.length - 3 }} more
                  </span>
                }
              </div>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class Services {
  protected services = signal<Service[]>([
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Manage events, meetings, and schedules',
      icon: '📅',
      color: '#4285F4',
      bgColor: '#E8F0FE',
      tools: ['calendar_list', 'calendar_get', 'calendar_list_events', 'calendar_get_event', 'calendar_create_event', 'calendar_update_event', 'calendar_delete_event', 'calendar_quick_add', 'calendar_get_freebusy', 'calendar_today', 'calendar_upcoming'],
      features: ['List events', 'Create events', 'Quick add', 'Free/busy', 'Recurring events']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Read, send, and organize emails',
      icon: '✉️',
      color: '#EA4335',
      bgColor: '#FCE8E6',
      tools: ['gmail_get_profile', 'gmail_list_labels', 'gmail_list_messages', 'gmail_get_message', 'gmail_send', 'gmail_reply', 'gmail_trash', 'gmail_mark_read', 'gmail_mark_unread', 'gmail_search', 'gmail_get_unread', 'gmail_get_thread'],
      features: ['Send emails', 'Search', 'Labels', 'Threads', 'Mark read/unread']
    },
    {
      id: 'drive',
      name: 'Google Drive',
      description: 'Store, search, and manage files',
      icon: '📁',
      color: '#FBBC05',
      bgColor: '#FEF7E0',
      tools: ['drive_list_files', 'drive_get_file', 'drive_download_file', 'drive_upload_file', 'drive_delete_file', 'drive_create_folder', 'drive_search', 'drive_move_file', 'drive_copy_file', 'drive_rename_file'],
      features: ['Upload files', 'Download', 'Search', 'Folders', 'Move/Copy']
    },
    {
      id: 'docs',
      name: 'Google Docs',
      description: 'Create and edit documents',
      icon: '📄',
      color: '#4285F4',
      bgColor: '#E8F0FE',
      tools: ['docs_create', 'docs_read', 'docs_insert_text', 'docs_append_text', 'docs_replace_text', 'docs_list'],
      features: ['Create docs', 'Read content', 'Insert text', 'Find & replace']
    },
    {
      id: 'sheets',
      name: 'Google Sheets',
      description: 'Work with spreadsheets and data',
      icon: '📊',
      color: '#34A853',
      bgColor: '#E6F4EA',
      tools: ['sheets_create', 'sheets_get', 'sheets_read', 'sheets_update', 'sheets_append', 'sheets_clear', 'sheets_add_sheet', 'sheets_delete_sheet', 'sheets_list'],
      features: ['Read values', 'Update cells', 'Append rows', 'Multiple sheets']
    },
    {
      id: 'slides',
      name: 'Google Slides',
      description: 'Build and modify presentations',
      icon: '📽️',
      color: '#FBBC05',
      bgColor: '#FEF7E0',
      tools: ['slides_create', 'slides_get', 'slides_list', 'slides_add_slide', 'slides_delete_slide', 'slides_add_text', 'slides_add_image', 'slides_replace_text', 'slides_duplicate_slide'],
      features: ['Create slides', 'Add text', 'Add images', 'Duplicate']
    },
    {
      id: 'meet',
      name: 'Google Meet',
      description: 'Schedule and manage video meetings',
      icon: '🎥',
      color: '#34A853',
      bgColor: '#E6F4EA',
      tools: ['meet_create_space', 'meet_get_space', 'meet_end_conference', 'meet_schedule', 'meet_create_instant', 'meet_get_by_event', 'meet_list_upcoming', 'meet_list_conference_records', 'meet_get_conference_record', 'meet_list_participants', 'meet_list_recordings', 'meet_get_recording', 'meet_list_transcripts', 'meet_get_transcript', 'meet_list_transcript_entries'],
      features: ['Schedule meetings', 'Instant meet', 'Recordings', 'Transcripts', 'Participants']
    },
    {
      id: 'chat',
      name: 'Google Chat',
      description: 'Send messages and manage spaces',
      icon: '💬',
      color: '#34A853',
      bgColor: '#E6F4EA',
      tools: ['chat_list_spaces', 'chat_get_space', 'chat_create_space', 'chat_delete_space', 'chat_list_messages', 'chat_get_message', 'chat_send_message', 'chat_update_message', 'chat_delete_message', 'chat_list_members', 'chat_add_member', 'chat_remove_member', 'chat_add_reaction'],
      features: ['Send messages', 'Create spaces', 'Members', 'Reactions', 'Threads']
    },
    {
      id: 'forms',
      name: 'Google Forms',
      description: 'Create surveys and collect responses',
      icon: '📝',
      color: '#673AB7',
      bgColor: '#EDE7F6',
      tools: ['forms_create', 'forms_get', 'forms_update_info', 'forms_add_question', 'forms_delete_item', 'forms_list_responses', 'forms_get_response', 'forms_add_page_break', 'forms_add_text', 'forms_add_image', 'forms_add_video'],
      features: ['Create forms', 'Add questions', 'Get responses', 'Images/Videos']
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Search videos and manage playlists',
      icon: '▶️',
      color: '#FF0000',
      bgColor: '#FFEBEE',
      tools: ['youtube_search', 'youtube_get_video', 'youtube_get_channel', 'youtube_get_my_channel', 'youtube_list_playlists', 'youtube_get_playlist_items', 'youtube_get_video_comments', 'youtube_list_subscriptions', 'youtube_list_liked_videos', 'youtube_rate_video'],
      features: ['Search videos', 'Playlists', 'Comments', 'Subscriptions', 'Like/Dislike']
    },
    {
      id: 'tasks',
      name: 'Google Tasks',
      description: 'Manage to-do lists and tasks',
      icon: '✅',
      color: '#4285F4',
      bgColor: '#E8F0FE',
      tools: ['tasks_list_tasklists', 'tasks_create_tasklist', 'tasks_delete_tasklist', 'tasks_list_tasks', 'tasks_create_task', 'tasks_update_task', 'tasks_delete_task', 'tasks_complete_task', 'notes_create', 'notes_list', 'notes_update', 'notes_delete'],
      features: ['Task lists', 'Create tasks', 'Complete tasks', 'Notes (Keep-like)']
    },
    {
      id: 'contacts',
      name: 'Google Contacts',
      description: 'Manage contacts and contact groups',
      icon: '👥',
      color: '#4285F4',
      bgColor: '#E8F0FE',
      tools: ['contacts_list', 'contacts_get', 'contacts_search', 'contacts_create', 'contacts_delete', 'contacts_list_groups'],
      features: ['List contacts', 'Search', 'Create', 'Contact groups']
    },
  ]);
}

