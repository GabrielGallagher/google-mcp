import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Tool {
  name: string;
  description: string;
  service: string;
  serviceIcon: string;
  parameters?: string[];
}

@Component({
  selector: 'app-tools',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8">
        <a routerLink="/" class="text-[var(--color-google-blue)] hover:underline">Home</a>
        <span class="text-[var(--color-google-gray-400)]">/</span>
        <span class="text-[var(--color-google-gray-600)]">Tools</span>
      </nav>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-normal text-[var(--color-google-gray-900)] mb-2">MCP Tools</h1>
          <p class="text-[var(--color-google-gray-600)]">
            {{ filteredTools().length }} tools available across all services
          </p>
        </div>

        <!-- Search & Filter -->
        <div class="flex gap-4">
          <div class="google-search-box flex items-center px-4 py-2 bg-white w-64">
            <svg class="w-4 h-4 text-[var(--color-google-gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Filter tools..."
              class="flex-1 bg-transparent border-none outline-none px-3 text-sm"
              [(ngModel)]="searchFilter"
            >
          </div>

          <select
            [(ngModel)]="serviceFilter"
            class="px-4 py-2 border border-[var(--color-google-gray-300)] rounded-md text-sm text-[var(--color-google-gray-700)] bg-white"
          >
            <option value="">All Services</option>
            @for (service of serviceOptions; track service) {
              <option [value]="service">{{ service }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="space-y-3">
        @for (tool of filteredTools(); track tool.name) {
          <div class="google-card p-4 hover:border-[var(--color-google-blue)]">
            <div class="flex items-start gap-4">
              <span class="text-xl flex-shrink-0">{{ tool.serviceIcon }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <code class="text-sm font-medium text-[var(--color-google-blue)] bg-[var(--color-google-blue-light)] px-2 py-0.5 rounded">
                    {{ tool.name }}
                  </code>
                  <span class="text-xs text-[var(--color-google-gray-500)]">{{ tool.service }}</span>
                </div>
                <p class="text-sm text-[var(--color-google-gray-600)]">{{ tool.description }}</p>
                @if (tool.parameters && tool.parameters.length > 0) {
                  <div class="mt-2 flex flex-wrap gap-1">
                    @for (param of tool.parameters; track param) {
                      <span class="text-xs px-2 py-0.5 rounded bg-[var(--color-google-gray-100)] text-[var(--color-google-gray-600)]">
                        {{ param }}
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>

      @if (filteredTools().length === 0) {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-lg font-medium text-[var(--color-google-gray-700)] mb-2">No tools found</h3>
          <p class="text-[var(--color-google-gray-500)]">Try adjusting your search or filter</p>
        </div>
      }
    </div>
  `,
})
export class Tools {
  protected searchFilter = '';
  protected serviceFilter = '';

  protected serviceOptions = [
    'Authentication',
    'Calendar',
    'Gmail',
    'Drive',
    'Docs',
    'Sheets',
    'Slides',
    'Meet',
    'Chat',
    'Forms',
    'YouTube',
    'Tasks',
    'Contacts',
  ];

  protected tools = signal<Tool[]>([
    // Authentication
    { name: 'google_auth', description: 'Initiate OAuth authentication with Google', service: 'Authentication', serviceIcon: '🔐' },
    { name: 'google_auth_status', description: 'Check current authentication status', service: 'Authentication', serviceIcon: '🔐' },
    { name: 'google_auth_code', description: 'Manually set authorization code', service: 'Authentication', serviceIcon: '🔐', parameters: ['code'] },
    { name: 'google_logout', description: 'Log out and clear stored tokens', service: 'Authentication', serviceIcon: '🔐' },

    // Calendar
    { name: 'calendar_list', description: 'List all calendars', service: 'Calendar', serviceIcon: '📅' },
    { name: 'calendar_get', description: 'Get calendar details', service: 'Calendar', serviceIcon: '📅', parameters: ['calendarId'] },
    { name: 'calendar_list_events', description: 'List events from a calendar', service: 'Calendar', serviceIcon: '📅', parameters: ['calendarId', 'timeMin', 'timeMax', 'maxResults'] },
    { name: 'calendar_get_event', description: 'Get event details', service: 'Calendar', serviceIcon: '📅', parameters: ['calendarId', 'eventId'] },
    { name: 'calendar_create_event', description: 'Create a new event', service: 'Calendar', serviceIcon: '📅', parameters: ['summary', 'start', 'end', 'attendees'] },
    { name: 'calendar_update_event', description: 'Update an existing event', service: 'Calendar', serviceIcon: '📅', parameters: ['calendarId', 'eventId'] },
    { name: 'calendar_delete_event', description: 'Delete an event', service: 'Calendar', serviceIcon: '📅', parameters: ['calendarId', 'eventId'] },
    { name: 'calendar_quick_add', description: 'Add event via natural language', service: 'Calendar', serviceIcon: '📅', parameters: ['text'] },
    { name: 'calendar_get_freebusy', description: 'Check availability', service: 'Calendar', serviceIcon: '📅', parameters: ['timeMin', 'timeMax', 'calendarIds'] },
    { name: 'calendar_today', description: "Get today's events", service: 'Calendar', serviceIcon: '📅' },
    { name: 'calendar_upcoming', description: 'Get upcoming events', service: 'Calendar', serviceIcon: '📅', parameters: ['days'] },

    // Gmail
    { name: 'gmail_get_profile', description: 'Get Gmail profile info', service: 'Gmail', serviceIcon: '✉️' },
    { name: 'gmail_list_labels', description: 'List Gmail labels', service: 'Gmail', serviceIcon: '✉️' },
    { name: 'gmail_list_messages', description: 'List emails', service: 'Gmail', serviceIcon: '✉️', parameters: ['labelIds', 'maxResults', 'query'] },
    { name: 'gmail_get_message', description: 'Get specific email', service: 'Gmail', serviceIcon: '✉️', parameters: ['messageId'] },
    { name: 'gmail_send', description: 'Send an email', service: 'Gmail', serviceIcon: '✉️', parameters: ['to', 'subject', 'body'] },
    { name: 'gmail_reply', description: 'Reply to an email', service: 'Gmail', serviceIcon: '✉️', parameters: ['threadId', 'body'] },
    { name: 'gmail_trash', description: 'Move to trash', service: 'Gmail', serviceIcon: '✉️', parameters: ['messageId'] },
    { name: 'gmail_mark_read', description: 'Mark as read', service: 'Gmail', serviceIcon: '✉️', parameters: ['messageId'] },
    { name: 'gmail_mark_unread', description: 'Mark as unread', service: 'Gmail', serviceIcon: '✉️', parameters: ['messageId'] },
    { name: 'gmail_search', description: 'Search emails', service: 'Gmail', serviceIcon: '✉️', parameters: ['query'] },
    { name: 'gmail_get_unread', description: 'Get unread emails', service: 'Gmail', serviceIcon: '✉️' },
    { name: 'gmail_get_thread', description: 'Get email thread', service: 'Gmail', serviceIcon: '✉️', parameters: ['threadId'] },

    // Drive
    { name: 'drive_list_files', description: 'List files', service: 'Drive', serviceIcon: '📁', parameters: ['pageSize', 'query', 'folderId'] },
    { name: 'drive_get_file', description: 'Get file metadata', service: 'Drive', serviceIcon: '📁', parameters: ['fileId'] },
    { name: 'drive_download_file', description: 'Download file content', service: 'Drive', serviceIcon: '📁', parameters: ['fileId'] },
    { name: 'drive_upload_file', description: 'Upload a new file', service: 'Drive', serviceIcon: '📁', parameters: ['name', 'content', 'mimeType', 'folderId'] },
    { name: 'drive_delete_file', description: 'Delete a file', service: 'Drive', serviceIcon: '📁', parameters: ['fileId'] },
    { name: 'drive_create_folder', description: 'Create a folder', service: 'Drive', serviceIcon: '📁', parameters: ['name', 'parentId'] },
    { name: 'drive_search', description: 'Search files', service: 'Drive', serviceIcon: '📁', parameters: ['query'] },
    { name: 'drive_move_file', description: 'Move file to folder', service: 'Drive', serviceIcon: '📁', parameters: ['fileId', 'folderId'] },
    { name: 'drive_copy_file', description: 'Copy a file', service: 'Drive', serviceIcon: '📁', parameters: ['fileId', 'name'] },
    { name: 'drive_rename_file', description: 'Rename a file', service: 'Drive', serviceIcon: '📁', parameters: ['fileId', 'name'] },

    // Docs
    { name: 'docs_create', description: 'Create a document', service: 'Docs', serviceIcon: '📄', parameters: ['title', 'content'] },
    { name: 'docs_read', description: 'Read document content', service: 'Docs', serviceIcon: '📄', parameters: ['documentId'] },
    { name: 'docs_insert_text', description: 'Insert text', service: 'Docs', serviceIcon: '📄', parameters: ['documentId', 'text', 'index'] },
    { name: 'docs_append_text', description: 'Append text', service: 'Docs', serviceIcon: '📄', parameters: ['documentId', 'text'] },
    { name: 'docs_replace_text', description: 'Find and replace', service: 'Docs', serviceIcon: '📄', parameters: ['documentId', 'find', 'replace'] },
    { name: 'docs_list', description: 'List documents', service: 'Docs', serviceIcon: '📄' },

    // Sheets
    { name: 'sheets_create', description: 'Create spreadsheet', service: 'Sheets', serviceIcon: '📊', parameters: ['title'] },
    { name: 'sheets_get', description: 'Get spreadsheet info', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId'] },
    { name: 'sheets_read', description: 'Read values', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'range'] },
    { name: 'sheets_update', description: 'Update values', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'range', 'values'] },
    { name: 'sheets_append', description: 'Append rows', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'range', 'values'] },
    { name: 'sheets_clear', description: 'Clear range', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'range'] },
    { name: 'sheets_add_sheet', description: 'Add sheet', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'title'] },
    { name: 'sheets_delete_sheet', description: 'Delete sheet', service: 'Sheets', serviceIcon: '📊', parameters: ['spreadsheetId', 'sheetId'] },
    { name: 'sheets_list', description: 'List spreadsheets', service: 'Sheets', serviceIcon: '📊' },

    // Slides
    { name: 'slides_create', description: 'Create presentation', service: 'Slides', serviceIcon: '📽️', parameters: ['title'] },
    { name: 'slides_get', description: 'Get presentation', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId'] },
    { name: 'slides_list', description: 'List presentations', service: 'Slides', serviceIcon: '📽️' },
    { name: 'slides_add_slide', description: 'Add a slide', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'layoutType'] },
    { name: 'slides_delete_slide', description: 'Delete a slide', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'slideObjectId'] },
    { name: 'slides_add_text', description: 'Add text box', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'slideObjectId', 'text'] },
    { name: 'slides_add_image', description: 'Add image', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'slideObjectId', 'imageUrl'] },
    { name: 'slides_replace_text', description: 'Find/replace text', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'searchText', 'replaceText'] },
    { name: 'slides_duplicate_slide', description: 'Duplicate slide', service: 'Slides', serviceIcon: '📽️', parameters: ['presentationId', 'slideObjectId'] },

    // Meet
    { name: 'meet_create_space', description: 'Create meeting space', service: 'Meet', serviceIcon: '🎥', parameters: ['accessType'] },
    { name: 'meet_get_space', description: 'Get space details', service: 'Meet', serviceIcon: '🎥', parameters: ['spaceName'] },
    { name: 'meet_end_conference', description: 'End active meeting', service: 'Meet', serviceIcon: '🎥', parameters: ['spaceName'] },
    { name: 'meet_schedule', description: 'Schedule a meeting', service: 'Meet', serviceIcon: '🎥', parameters: ['summary', 'startTime', 'endTime', 'attendees'] },
    { name: 'meet_create_instant', description: 'Create instant meeting', service: 'Meet', serviceIcon: '🎥' },
    { name: 'meet_get_by_event', description: 'Get meeting from event', service: 'Meet', serviceIcon: '🎥', parameters: ['eventId'] },
    { name: 'meet_list_upcoming', description: 'List upcoming meetings', service: 'Meet', serviceIcon: '🎥', parameters: ['days'] },
    { name: 'meet_list_conference_records', description: 'List past meetings', service: 'Meet', serviceIcon: '🎥' },
    { name: 'meet_list_participants', description: 'List participants', service: 'Meet', serviceIcon: '🎥', parameters: ['conferenceRecordName'] },
    { name: 'meet_list_recordings', description: 'List recordings', service: 'Meet', serviceIcon: '🎥', parameters: ['conferenceRecordName'] },
    { name: 'meet_list_transcripts', description: 'List transcripts', service: 'Meet', serviceIcon: '🎥', parameters: ['conferenceRecordName'] },

    // Chat
    { name: 'chat_list_spaces', description: 'List Chat spaces', service: 'Chat', serviceIcon: '💬' },
    { name: 'chat_get_space', description: 'Get space details', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName'] },
    { name: 'chat_create_space', description: 'Create a space', service: 'Chat', serviceIcon: '💬', parameters: ['displayName', 'spaceType'] },
    { name: 'chat_delete_space', description: 'Delete a space', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName'] },
    { name: 'chat_list_messages', description: 'List messages', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName'] },
    { name: 'chat_send_message', description: 'Send a message', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName', 'text'] },
    { name: 'chat_update_message', description: 'Update a message', service: 'Chat', serviceIcon: '💬', parameters: ['messageName', 'text'] },
    { name: 'chat_delete_message', description: 'Delete a message', service: 'Chat', serviceIcon: '💬', parameters: ['messageName'] },
    { name: 'chat_list_members', description: 'List members', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName'] },
    { name: 'chat_add_member', description: 'Add a member', service: 'Chat', serviceIcon: '💬', parameters: ['spaceName', 'userId'] },
    { name: 'chat_add_reaction', description: 'Add emoji reaction', service: 'Chat', serviceIcon: '💬', parameters: ['messageName', 'emoji'] },

    // Forms
    { name: 'forms_create', description: 'Create a form', service: 'Forms', serviceIcon: '📝', parameters: ['title', 'description'] },
    { name: 'forms_get', description: 'Get form details', service: 'Forms', serviceIcon: '📝', parameters: ['formId'] },
    { name: 'forms_update_info', description: 'Update form info', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'title', 'description'] },
    { name: 'forms_add_question', description: 'Add a question', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'title', 'questionType'] },
    { name: 'forms_delete_item', description: 'Delete form item', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'itemIndex'] },
    { name: 'forms_list_responses', description: 'List responses', service: 'Forms', serviceIcon: '📝', parameters: ['formId'] },
    { name: 'forms_get_response', description: 'Get response', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'responseId'] },
    { name: 'forms_add_image', description: 'Add image', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'sourceUri'] },
    { name: 'forms_add_video', description: 'Add video', service: 'Forms', serviceIcon: '📝', parameters: ['formId', 'youtubeUri'] },

    // YouTube
    { name: 'youtube_search', description: 'Search YouTube', service: 'YouTube', serviceIcon: '▶️', parameters: ['query', 'type', 'maxResults'] },
    { name: 'youtube_get_video', description: 'Get video details', service: 'YouTube', serviceIcon: '▶️', parameters: ['videoId'] },
    { name: 'youtube_get_channel', description: 'Get channel details', service: 'YouTube', serviceIcon: '▶️', parameters: ['channelId'] },
    { name: 'youtube_get_my_channel', description: 'Get your channel', service: 'YouTube', serviceIcon: '▶️' },
    { name: 'youtube_list_playlists', description: 'List playlists', service: 'YouTube', serviceIcon: '▶️' },
    { name: 'youtube_get_playlist_items', description: 'Get playlist videos', service: 'YouTube', serviceIcon: '▶️', parameters: ['playlistId'] },
    { name: 'youtube_get_video_comments', description: 'Get comments', service: 'YouTube', serviceIcon: '▶️', parameters: ['videoId'] },
    { name: 'youtube_list_subscriptions', description: 'List subscriptions', service: 'YouTube', serviceIcon: '▶️' },
    { name: 'youtube_rate_video', description: 'Like/dislike video', service: 'YouTube', serviceIcon: '▶️', parameters: ['videoId', 'rating'] },

    // Tasks
    { name: 'tasks_list_tasklists', description: 'List task lists', service: 'Tasks', serviceIcon: '✅' },
    { name: 'tasks_create_tasklist', description: 'Create task list', service: 'Tasks', serviceIcon: '✅', parameters: ['title'] },
    { name: 'tasks_delete_tasklist', description: 'Delete task list', service: 'Tasks', serviceIcon: '✅', parameters: ['tasklistId'] },
    { name: 'tasks_list_tasks', description: 'List tasks', service: 'Tasks', serviceIcon: '✅', parameters: ['tasklistId'] },
    { name: 'tasks_create_task', description: 'Create task', service: 'Tasks', serviceIcon: '✅', parameters: ['tasklistId', 'title', 'notes'] },
    { name: 'tasks_update_task', description: 'Update task', service: 'Tasks', serviceIcon: '✅', parameters: ['tasklistId', 'taskId'] },
    { name: 'tasks_complete_task', description: 'Complete task', service: 'Tasks', serviceIcon: '✅', parameters: ['tasklistId', 'taskId'] },
    { name: 'notes_create', description: 'Create a note', service: 'Tasks', serviceIcon: '✅', parameters: ['title', 'content'] },
    { name: 'notes_list', description: 'List notes', service: 'Tasks', serviceIcon: '✅' },

    // Contacts
    { name: 'contacts_list', description: 'List contacts', service: 'Contacts', serviceIcon: '👥', parameters: ['pageSize'] },
    { name: 'contacts_get', description: 'Get contact', service: 'Contacts', serviceIcon: '👥', parameters: ['resourceName'] },
    { name: 'contacts_search', description: 'Search contacts', service: 'Contacts', serviceIcon: '👥', parameters: ['query'] },
    { name: 'contacts_create', description: 'Create contact', service: 'Contacts', serviceIcon: '👥', parameters: ['givenName', 'familyName', 'email'] },
    { name: 'contacts_delete', description: 'Delete contact', service: 'Contacts', serviceIcon: '👥', parameters: ['resourceName'] },
    { name: 'contacts_list_groups', description: 'List groups', service: 'Contacts', serviceIcon: '👥' },
  ]);

  protected filteredTools = computed(() => {
    let result = this.tools();

    if (this.searchFilter) {
      const search = this.searchFilter.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    if (this.serviceFilter) {
      result = result.filter((t) => t.service === this.serviceFilter);
    }

    return result;
  });
}

