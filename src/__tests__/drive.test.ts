import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Auth } from "googleapis";

// Mock the entire googleapis module
const mockFilesList = vi.fn();
const mockFilesGet = vi.fn();
const mockFilesCreate = vi.fn();
const mockFilesUpdate = vi.fn();
const mockFilesDelete = vi.fn();
const mockFilesCopy = vi.fn();
const mockFilesExport = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    drive: () => ({
      files: {
        list: mockFilesList,
        get: mockFilesGet,
        create: mockFilesCreate,
        update: mockFilesUpdate,
        delete: mockFilesDelete,
        copy: mockFilesCopy,
        export: mockFilesExport,
      },
    }),
  },
}));

// Import after mocking
import { DriveService } from "../services/drive.js";

describe("DriveService", () => {
  let service: DriveService;
  const mockAuth = {} as Auth.OAuth2Client;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DriveService(mockAuth);
  });

  describe("listFiles", () => {
    it("should list files with default options", async () => {
      mockFilesList.mockResolvedValue({
        data: {
          files: [
            { id: "f1", name: "File1.txt", mimeType: "text/plain" },
          ],
          nextPageToken: "token",
        },
      });

      const result = await service.listFiles();

      expect(mockFilesList).toHaveBeenCalled();
      expect(result.files).toHaveLength(1);
      expect(result.files[0].id).toBe("f1");
    });

    it("should handle empty results", async () => {
      mockFilesList.mockResolvedValue({ data: { files: null } });

      const result = await service.listFiles();

      expect(result.files).toHaveLength(0);
    });

    it("should pass custom options", async () => {
      mockFilesList.mockResolvedValue({ data: { files: [] } });

      await service.listFiles({ pageSize: 10, folderId: "folder1" });

      expect(mockFilesList).toHaveBeenCalledWith(
        expect.objectContaining({ pageSize: 10 })
      );
    });
  });

  describe("getFile", () => {
    it("should get file by ID", async () => {
      mockFilesGet.mockResolvedValue({
        data: { id: "f1", name: "Test.txt", mimeType: "text/plain" },
      });

      const result = await service.getFile("f1");

      expect(mockFilesGet).toHaveBeenCalledWith(
        expect.objectContaining({ fileId: "f1" })
      );
      expect(result.id).toBe("f1");
    });
  });

  describe("downloadFile", () => {
    it("should download regular file content", async () => {
      mockFilesGet
        .mockResolvedValueOnce({ data: { id: "f1", name: "test.txt", mimeType: "text/plain" } })
        .mockResolvedValueOnce({ data: "File content" });

      const result = await service.downloadFile("f1");

      expect(result).toBe("File content");
    });

    it("should export Google Docs as text", async () => {
      mockFilesGet.mockResolvedValue({
        data: { id: "f1", name: "Doc", mimeType: "application/vnd.google-apps.document" },
      });
      mockFilesExport.mockResolvedValue({ data: "Document text" });

      const result = await service.downloadFile("f1");

      expect(mockFilesExport).toHaveBeenCalledWith(
        expect.objectContaining({ mimeType: "text/plain" }),
        expect.any(Object)
      );
      expect(result).toBe("Document text");
    });

    it("should export Google Sheets as CSV", async () => {
      mockFilesGet.mockResolvedValue({
        data: { id: "f1", name: "Sheet", mimeType: "application/vnd.google-apps.spreadsheet" },
      });
      mockFilesExport.mockResolvedValue({ data: "a,b\n1,2" });

      const result = await service.downloadFile("f1");

      expect(mockFilesExport).toHaveBeenCalledWith(
        expect.objectContaining({ mimeType: "text/csv" }),
        expect.any(Object)
      );
      expect(result).toBe("a,b\n1,2");
    });
  });

  describe("uploadFile", () => {
    it("should upload file", async () => {
      mockFilesCreate.mockResolvedValue({
        data: { id: "new1", name: "uploaded.txt", mimeType: "text/plain" },
      });

      const result = await service.uploadFile("uploaded.txt", "content");

      expect(mockFilesCreate).toHaveBeenCalled();
      expect(result.id).toBe("new1");
    });

    it("should upload to folder", async () => {
      mockFilesCreate.mockResolvedValue({
        data: { id: "new1", name: "test.txt", mimeType: "text/plain" },
      });

      await service.uploadFile("test.txt", "content", "text/plain", "folder1");

      expect(mockFilesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: expect.objectContaining({ parents: ["folder1"] }),
        })
      );
    });
  });

  describe("updateFile", () => {
    it("should update file content", async () => {
      mockFilesUpdate.mockResolvedValue({
        data: { id: "f1", name: "updated.txt", mimeType: "text/plain" },
      });

      const result = await service.updateFile("f1", "new content");

      expect(mockFilesUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ fileId: "f1" })
      );
      expect(result.id).toBe("f1");
    });
  });

  describe("deleteFile", () => {
    it("should delete file", async () => {
      mockFilesDelete.mockResolvedValue({});

      await service.deleteFile("f1");

      expect(mockFilesDelete).toHaveBeenCalledWith({ fileId: "f1" });
    });
  });

  describe("createFolder", () => {
    it("should create folder", async () => {
      mockFilesCreate.mockResolvedValue({
        data: { id: "folder1", name: "New Folder", mimeType: "application/vnd.google-apps.folder" },
      });

      const result = await service.createFolder("New Folder");

      expect(mockFilesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: expect.objectContaining({
            mimeType: "application/vnd.google-apps.folder",
          }),
        })
      );
      expect(result.mimeType).toBe("application/vnd.google-apps.folder");
    });
  });

  describe("search", () => {
    it("should search files", async () => {
      mockFilesList.mockResolvedValue({
        data: { files: [{ id: "f1", name: "Match.txt", mimeType: "text/plain" }] },
      });

      const result = await service.search("Match");

      expect(mockFilesList).toHaveBeenCalledWith(
        expect.objectContaining({
          q: expect.stringContaining("Match"),
        })
      );
      expect(result.files).toHaveLength(1);
    });

    it("should escape single quotes", async () => {
      mockFilesList.mockResolvedValue({ data: { files: [] } });

      await service.search("John's file");

      expect(mockFilesList).toHaveBeenCalledWith(
        expect.objectContaining({
          q: expect.stringContaining("\\'"),
        })
      );
    });
  });

  describe("moveFile", () => {
    it("should move file to new folder", async () => {
      mockFilesGet.mockResolvedValue({ data: { parents: ["old"] } });
      mockFilesUpdate.mockResolvedValue({
        data: { id: "f1", name: "file.txt", mimeType: "text/plain" },
      });

      await service.moveFile("f1", "new");

      expect(mockFilesUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          addParents: "new",
          removeParents: "old",
        })
      );
    });
  });

  describe("copyFile", () => {
    it("should copy file", async () => {
      mockFilesCopy.mockResolvedValue({
        data: { id: "copy1", name: "Copy.txt", mimeType: "text/plain" },
      });

      const result = await service.copyFile("f1", "Copy.txt");

      expect(mockFilesCopy).toHaveBeenCalledWith(
        expect.objectContaining({ fileId: "f1" })
      );
      expect(result.id).toBe("copy1");
    });
  });

  describe("renameFile", () => {
    it("should rename file", async () => {
      mockFilesUpdate.mockResolvedValue({
        data: { id: "f1", name: "NewName.txt", mimeType: "text/plain" },
      });

      const result = await service.renameFile("f1", "NewName.txt");

      expect(mockFilesUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: { name: "NewName.txt" },
        })
      );
      expect(result.name).toBe("NewName.txt");
    });
  });
});
