import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Auth } from "googleapis";

const mockTasklistsList = vi.fn();
const mockTasklistsGet = vi.fn();
const mockTasklistsInsert = vi.fn();
const mockTasklistsUpdate = vi.fn();
const mockTasklistsDelete = vi.fn();
const mockTasksList = vi.fn();
const mockTasksGet = vi.fn();
const mockTasksInsert = vi.fn();
const mockTasksUpdate = vi.fn();
const mockTasksDelete = vi.fn();
const mockTasksClear = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    tasks: () => ({
      tasklists: {
        list: mockTasklistsList,
        get: mockTasklistsGet,
        insert: mockTasklistsInsert,
        update: mockTasklistsUpdate,
        delete: mockTasklistsDelete,
      },
      tasks: {
        list: mockTasksList,
        get: mockTasksGet,
        insert: mockTasksInsert,
        update: mockTasksUpdate,
        delete: mockTasksDelete,
        clear: mockTasksClear,
      },
    }),
  },
}));

import { TasksService } from "../services/tasks.js";

describe("TasksService", () => {
  let service: TasksService;
  const mockAuth = {} as Auth.OAuth2Client;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TasksService(mockAuth);
  });

  describe("Task Lists", () => {
    describe("listTaskLists", () => {
      it("should list all task lists", async () => {
        mockTasklistsList.mockResolvedValue({
          data: {
            items: [
              { id: "list1", title: "Personal", updated: "2024-01-01" },
              { id: "list2", title: "Work", updated: "2024-01-02" },
            ],
          },
        });

        const result = await service.listTaskLists();

        expect(result).toHaveLength(2);
        expect(result[0].title).toBe("Personal");
      });

      it("should handle empty list", async () => {
        mockTasklistsList.mockResolvedValue({ data: { items: null } });

        const result = await service.listTaskLists();

        expect(result).toHaveLength(0);
      });
    });

    describe("getTaskList", () => {
      it("should get task list by ID", async () => {
        mockTasklistsGet.mockResolvedValue({
          data: { id: "list1", title: "Personal", updated: "2024-01-01" },
        });

        const result = await service.getTaskList("list1");

        expect(result.id).toBe("list1");
        expect(result.title).toBe("Personal");
      });
    });

    describe("createTaskList", () => {
      it("should create task list", async () => {
        mockTasklistsInsert.mockResolvedValue({
          data: { id: "new", title: "New List", updated: "2024-01-01" },
        });

        const result = await service.createTaskList("New List");

        expect(result.title).toBe("New List");
      });
    });

    describe("updateTaskList", () => {
      it("should update task list", async () => {
        mockTasklistsUpdate.mockResolvedValue({
          data: { id: "list1", title: "Updated", updated: "2024-01-02" },
        });

        const result = await service.updateTaskList("list1", "Updated");

        expect(result.title).toBe("Updated");
      });
    });

    describe("deleteTaskList", () => {
      it("should delete task list", async () => {
        mockTasklistsDelete.mockResolvedValue({});

        await service.deleteTaskList("list1");

        expect(mockTasklistsDelete).toHaveBeenCalledWith({ tasklist: "list1" });
      });
    });
  });

  describe("Tasks", () => {
    describe("listTasks", () => {
      it("should list tasks", async () => {
        mockTasksList.mockResolvedValue({
          data: {
            items: [
              { id: "task1", title: "Task 1", status: "needsAction" },
              { id: "task2", title: "Task 2", status: "completed" },
            ],
            nextPageToken: "token",
          },
        });

        const result = await service.listTasks("list1");

        expect(result.tasks).toHaveLength(2);
        expect(result.nextPageToken).toBe("token");
      });

      it("should apply options", async () => {
        mockTasksList.mockResolvedValue({ data: { items: [] } });

        await service.listTasks("list1", {
          showCompleted: false,
          maxResults: 50,
        });

        expect(mockTasksList).toHaveBeenCalledWith(
          expect.objectContaining({
            showCompleted: false,
            maxResults: 50,
          })
        );
      });
    });

    describe("getTask", () => {
      it("should get task by ID", async () => {
        mockTasksGet.mockResolvedValue({
          data: {
            id: "task1",
            title: "Task",
            notes: "Notes",
            status: "needsAction",
            due: "2024-12-31",
          },
        });

        const result = await service.getTask("list1", "task1");

        expect(result.id).toBe("task1");
        expect(result.notes).toBe("Notes");
      });
    });

    describe("createTask", () => {
      it("should create task", async () => {
        mockTasksInsert.mockResolvedValue({
          data: { id: "new", title: "New Task", status: "needsAction" },
        });

        const result = await service.createTask("list1", { title: "New Task" });

        expect(result.title).toBe("New Task");
      });

      it("should create task with all options", async () => {
        mockTasksInsert.mockResolvedValue({
          data: { id: "new", title: "Full", notes: "Notes", status: "needsAction" },
        });

        await service.createTask("list1", {
          title: "Full",
          notes: "Notes",
          due: "2024-12-31",
          parent: "parent1",
        });

        expect(mockTasksInsert).toHaveBeenCalledWith({
          tasklist: "list1",
          requestBody: { title: "Full", notes: "Notes", due: "2024-12-31" },
          parent: "parent1",
        });
      });
    });

    describe("updateTask", () => {
      it("should update task", async () => {
        mockTasksGet.mockResolvedValue({
          data: { id: "task1", title: "Old Title", status: "needsAction" },
        });
        mockTasksUpdate.mockResolvedValue({
          data: { id: "task1", title: "Updated", status: "needsAction" },
        });

        const result = await service.updateTask("list1", "task1", { title: "Updated" });

        expect(result.title).toBe("Updated");
      });
    });

    describe("deleteTask", () => {
      it("should delete task", async () => {
        mockTasksDelete.mockResolvedValue({});

        await service.deleteTask("list1", "task1");

        expect(mockTasksDelete).toHaveBeenCalledWith({
          tasklist: "list1",
          task: "task1",
        });
      });
    });

    describe("completeTask", () => {
      it("should mark task completed", async () => {
        // completeTask calls updateTask, which calls getTask first
        mockTasksGet.mockResolvedValue({
          data: { id: "task1", title: "Task", status: "needsAction" },
        });
        mockTasksUpdate.mockResolvedValue({
          data: { id: "task1", title: "Task", status: "completed" },
        });

        const result = await service.completeTask("list1", "task1");

        expect(mockTasksUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            tasklist: "list1",
            task: "task1",
            requestBody: expect.objectContaining({ status: "completed" }),
          })
        );
        expect(result.status).toBe("completed");
      });
    });

    describe("uncompleteTask", () => {
      it("should mark task needs action", async () => {
        mockTasksGet.mockResolvedValue({
          data: { id: "task1", title: "Task", status: "completed" },
        });
        mockTasksUpdate.mockResolvedValue({
          data: { id: "task1", title: "Task", status: "needsAction" },
        });

        const result = await service.uncompleteTask("list1", "task1");

        expect(result.status).toBe("needsAction");
      });
    });

    describe("clearCompletedTasks", () => {
      it("should clear completed tasks", async () => {
        mockTasksClear.mockResolvedValue({});

        await service.clearCompletedTasks("list1");

        expect(mockTasksClear).toHaveBeenCalledWith({ tasklist: "list1" });
      });
    });
  });

  describe("Notes Operations", () => {
    describe("createNote", () => {
      it("should create note in existing Notes list", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "notes-list", title: "Notes" }] },
        });
        mockTasksInsert.mockResolvedValue({
          data: { id: "note1", title: "Note Title", notes: "Content", status: "needsAction" },
        });

        const result = await service.createNote("Note Title", "Content");

        expect(result.taskListId).toBe("notes-list");
        expect(result.task.notes).toBe("Content");
      });

      it("should create Notes list if it doesn't exist", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "list1", title: "Personal" }] },
        });
        mockTasklistsInsert.mockResolvedValue({
          data: { id: "new-notes-list", title: "Notes" },
        });
        mockTasksInsert.mockResolvedValue({
          data: { id: "note1", title: "Note", notes: "Content", status: "needsAction" },
        });

        const result = await service.createNote("Note", "Content");

        expect(mockTasklistsInsert).toHaveBeenCalledWith({
          requestBody: { title: "Notes" },
        });
        expect(result.taskListId).toBe("new-notes-list");
      });
    });

    describe("listNotes", () => {
      it("should list notes from Notes list", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "notes-list", title: "Notes" }] },
        });
        mockTasksList.mockResolvedValue({
          data: {
            items: [
              { id: "note1", title: "Note 1", notes: "Content 1", status: "needsAction" },
              { id: "note2", title: "Note 2", notes: "Content 2", status: "needsAction" },
            ],
          },
        });

        const result = await service.listNotes();

        expect(result).toHaveLength(2);
        expect(result[0].notes).toBe("Content 1");
      });

      it("should return empty array if Notes list doesn't exist", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "list1", title: "Personal" }] },
        });

        const result = await service.listNotes();

        expect(result).toHaveLength(0);
      });
    });

    describe("updateNote", () => {
      it("should update note", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "notes-list", title: "Notes" }] },
        });
        mockTasksGet.mockResolvedValue({
          data: { id: "note1", title: "Old Title", notes: "Old content", status: "needsAction" },
        });
        mockTasksUpdate.mockResolvedValue({
          data: { id: "note1", title: "Updated Title", notes: "New content", status: "needsAction" },
        });

        const result = await service.updateNote("note1", "Updated Title", "New content");

        expect(result.title).toBe("Updated Title");
        expect(result.notes).toBe("New content");
      });

      it("should throw if Notes list doesn't exist", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "list1", title: "Personal" }] },
        });

        await expect(service.updateNote("note1", "Title")).rejects.toThrow("Notes list not found");
      });
    });

    describe("deleteNote", () => {
      it("should delete note", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "notes-list", title: "Notes" }] },
        });
        mockTasksDelete.mockResolvedValue({});

        await service.deleteNote("note1");

        expect(mockTasksDelete).toHaveBeenCalledWith({
          tasklist: "notes-list",
          task: "note1",
        });
      });

      it("should throw if Notes list doesn't exist", async () => {
        mockTasklistsList.mockResolvedValue({
          data: { items: [{ id: "list1", title: "Personal" }] },
        });

        await expect(service.deleteNote("note1")).rejects.toThrow("Notes list not found");
      });
    });
  });
});
