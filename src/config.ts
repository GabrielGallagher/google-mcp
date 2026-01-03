type ScopeProfile = "readonly" | "editor" | "full";

const DEFAULT_SERVICES = ["gmail", "calendar", "drive", "docs", "sheets", "slides"];
const ALL_SERVICES = [
  "calendar",
  "gmail",
  "drive",
  "docs",
  "sheets",
  "slides",
  "tasks",
  "contacts",
  "youtube",
  "forms",
  "chat",
  "meet",
  "notes",
];

const TOOL_PREFIXES: Record<string, string> = {
  drive: "drive_",
  docs: "docs_",
  sheets: "sheets_",
  slides: "slides_",
  calendar: "calendar_",
  gmail: "gmail_",
  contacts: "contacts_",
  youtube: "youtube_",
  tasks: "tasks_",
  forms: "forms_",
  chat: "chat_",
  meet: "meet_",
  notes: "notes_",
};

const AUTH_TOOLS = new Set([
  "google_auth",
  "google_auth_status",
  "google_auth_code",
  "google_logout",
]);

const GMAIL_SEND_TOOLS = new Set(["gmail_send", "gmail_reply"]);
const GMAIL_MODIFY_TOOLS = new Set([
  "gmail_trash",
  "gmail_mark_read",
  "gmail_mark_unread",
]);
const GMAIL_COMPOSE_TOOLS = new Set(["gmail_create_draft"]);
const CALENDAR_WRITE_TOOLS = new Set([
  "calendar_create_event",
  "calendar_update_event",
  "calendar_delete_event",
  "calendar_quick_add",
]);

const SCOPE_MAP: Record<string, Record<ScopeProfile, string[]>> = {
  gmail: {
    readonly: ["https://www.googleapis.com/auth/gmail.readonly"],
    editor: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.compose",
    ],
    full: [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  },
  calendar: {
    readonly: ["https://www.googleapis.com/auth/calendar.readonly"],
    editor: ["https://www.googleapis.com/auth/calendar.readonly"],
    full: ["https://www.googleapis.com/auth/calendar"],
  },
  drive: {
    readonly: ["https://www.googleapis.com/auth/drive.readonly"],
    editor: ["https://www.googleapis.com/auth/drive"],
    full: ["https://www.googleapis.com/auth/drive"],
  },
  docs: {
    readonly: ["https://www.googleapis.com/auth/documents.readonly"],
    editor: ["https://www.googleapis.com/auth/documents"],
    full: ["https://www.googleapis.com/auth/documents"],
  },
  sheets: {
    readonly: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    editor: ["https://www.googleapis.com/auth/spreadsheets"],
    full: ["https://www.googleapis.com/auth/spreadsheets"],
  },
  slides: {
    readonly: ["https://www.googleapis.com/auth/presentations.readonly"],
    editor: ["https://www.googleapis.com/auth/presentations"],
    full: ["https://www.googleapis.com/auth/presentations"],
  },
  tasks: {
    readonly: [],
    editor: ["https://www.googleapis.com/auth/tasks"],
    full: ["https://www.googleapis.com/auth/tasks"],
  },
  contacts: {
    readonly: [],
    editor: ["https://www.googleapis.com/auth/contacts"],
    full: ["https://www.googleapis.com/auth/contacts"],
  },
  youtube: {
    readonly: [],
    editor: ["https://www.googleapis.com/auth/youtube"],
    full: ["https://www.googleapis.com/auth/youtube"],
  },
  forms: {
    readonly: ["https://www.googleapis.com/auth/forms.responses.readonly"],
    editor: [
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/forms.responses.readonly",
    ],
    full: [
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/forms.responses.readonly",
    ],
  },
  chat: {
    readonly: [],
    editor: [
      "https://www.googleapis.com/auth/chat.spaces",
      "https://www.googleapis.com/auth/chat.messages",
      "https://www.googleapis.com/auth/chat.memberships",
    ],
    full: [
      "https://www.googleapis.com/auth/chat.spaces",
      "https://www.googleapis.com/auth/chat.spaces.create",
      "https://www.googleapis.com/auth/chat.messages",
      "https://www.googleapis.com/auth/chat.messages.create",
      "https://www.googleapis.com/auth/chat.memberships",
    ],
  },
  meet: {
    readonly: ["https://www.googleapis.com/auth/meetings.space.readonly"],
    editor: [
      "https://www.googleapis.com/auth/meetings.space.created",
      "https://www.googleapis.com/auth/meetings.space.readonly",
    ],
    full: [
      "https://www.googleapis.com/auth/meetings.space.created",
      "https://www.googleapis.com/auth/meetings.space.readonly",
    ],
  },
  notes: {
    readonly: [],
    editor: ["https://www.googleapis.com/auth/tasks"],
    full: ["https://www.googleapis.com/auth/tasks"],
  },
};

function parseCsv(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[,\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
}

export function getScopeProfile(): ScopeProfile {
  const raw = (process.env.GOOGLE_MCP_SCOPE_PROFILE || "editor")
    .trim()
    .toLowerCase();
  if (raw === "readonly" || raw === "editor" || raw === "full") {
    return raw;
  }
  return "editor";
}

export function getEnabledServices(): Set<string> {
  const services = parseCsv(process.env.GOOGLE_MCP_SERVICES);
  if (services.length === 0) {
    return new Set(DEFAULT_SERVICES);
  }
  if (services.includes("all")) {
    return new Set(ALL_SERVICES);
  }
  return new Set(services);
}

export function getGmailFlags(profile: ScopeProfile) {
  return {
    allowCompose: parseBoolean(
      process.env.GOOGLE_MCP_GMAIL_COMPOSE,
      profile !== "readonly"
    ),
    allowModify: parseBoolean(
      process.env.GOOGLE_MCP_GMAIL_MODIFY,
      profile !== "readonly"
    ),
    allowSend: parseBoolean(
      process.env.GOOGLE_MCP_GMAIL_SEND,
      profile === "full"
    ),
  };
}

export function allowCalendarWrite(profile: ScopeProfile): boolean {
  return parseBoolean(
    process.env.GOOGLE_MCP_CALENDAR_WRITE,
    profile === "full"
  );
}

export function getScopes(): string[] {
  const explicit = parseCsv(process.env.GOOGLE_MCP_SCOPES);
  if (explicit.length > 0) {
    return Array.from(new Set(explicit));
  }

  const profile = getScopeProfile();
  const enabled = getEnabledServices();
  const scopes = new Set<string>();

  for (const service of enabled) {
    const map = SCOPE_MAP[service];
    if (!map) continue;
    const entries = map[profile] || [];
    for (const scope of entries) {
      scopes.add(scope);
    }
  }

  if (enabled.has("gmail")) {
    const gmailFlags = getGmailFlags(profile);
    if (!gmailFlags.allowCompose) {
      scopes.delete("https://www.googleapis.com/auth/gmail.compose");
    }
    if (!gmailFlags.allowModify) {
      scopes.delete("https://www.googleapis.com/auth/gmail.modify");
    }
    if (!gmailFlags.allowSend) {
      scopes.delete("https://www.googleapis.com/auth/gmail.send");
    }
  }

  if (enabled.has("calendar") && allowCalendarWrite(profile)) {
    scopes.delete("https://www.googleapis.com/auth/calendar.readonly");
    scopes.add("https://www.googleapis.com/auth/calendar");
  }

  return Array.from(scopes);
}

function resolveServiceForTool(toolName: string): string | null {
  for (const [service, prefix] of Object.entries(TOOL_PREFIXES)) {
    if (toolName.startsWith(prefix)) return service;
  }
  return null;
}

export function isToolEnabled(toolName: string): boolean {
  if (AUTH_TOOLS.has(toolName)) return true;

  const service = resolveServiceForTool(toolName);
  if (!service) return false;

  const enabled = getEnabledServices();
  if (!enabled.has(service)) return false;

  if (service === "gmail") {
    const flags = getGmailFlags(getScopeProfile());
    if (GMAIL_SEND_TOOLS.has(toolName)) return flags.allowSend;
    if (GMAIL_MODIFY_TOOLS.has(toolName)) return flags.allowModify;
    if (GMAIL_COMPOSE_TOOLS.has(toolName)) return flags.allowCompose;
  }

  if (service === "calendar") {
    if (CALENDAR_WRITE_TOOLS.has(toolName)) {
      return allowCalendarWrite(getScopeProfile());
    }
  }

  return true;
}
