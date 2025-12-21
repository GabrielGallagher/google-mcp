import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Auth } from "googleapis";

const mockChannelsList = vi.fn();
const mockSearchList = vi.fn();
const mockVideosList = vi.fn();
const mockPlaylistsList = vi.fn();
const mockPlaylistItemsList = vi.fn();
const mockSubscriptionsList = vi.fn();
const mockCommentThreadsList = vi.fn();
const mockVideosRate = vi.fn();
const mockCaptionsList = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    youtube: () => ({
      channels: { list: mockChannelsList },
      search: { list: mockSearchList },
      videos: { list: mockVideosList, rate: mockVideosRate },
      playlists: { list: mockPlaylistsList },
      playlistItems: { list: mockPlaylistItemsList },
      subscriptions: { list: mockSubscriptionsList },
      commentThreads: { list: mockCommentThreadsList },
      captions: { list: mockCaptionsList },
    }),
  },
}));

import { YouTubeService } from "../services/youtube.js";

describe("YouTubeService", () => {
  let service: YouTubeService;
  const mockAuth = {} as Auth.OAuth2Client;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new YouTubeService(mockAuth);
  });

  describe("getMyChannel", () => {
    it("should get user channel", async () => {
      mockChannelsList.mockResolvedValue({
        data: {
          items: [{
            id: "channel123",
            snippet: { title: "My Channel", description: "Description" },
            statistics: { subscriberCount: "1000", viewCount: "50000", videoCount: "100" },
          }],
        },
      });

      const result = await service.getMyChannel();

      expect(mockChannelsList).toHaveBeenCalledWith(
        expect.objectContaining({ mine: true })
      );
      expect(result.title).toBe("My Channel");
      expect(result.subscriberCount).toBe("1000");
    });

    it("should throw if no channel", async () => {
      mockChannelsList.mockResolvedValue({ data: { items: [] } });

      await expect(service.getMyChannel()).rejects.toThrow("No channel found");
    });
  });

  describe("search", () => {
    it("should search videos", async () => {
      mockSearchList.mockResolvedValue({
        data: {
          items: [{
            id: { videoId: "vid123" },
            snippet: { title: "Test Video", description: "Desc", channelTitle: "Channel", publishedAt: "2024-01-01" },
          }],
          nextPageToken: "token",
        },
      });

      const result = await service.search({ query: "test query" });

      expect(mockSearchList).toHaveBeenCalledWith(
        expect.objectContaining({ q: "test query" })
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe("Test Video");
    });
  });

  describe("getVideo", () => {
    it("should get video details", async () => {
      mockVideosList.mockResolvedValue({
        data: {
          items: [{
            id: "vid123",
            snippet: { title: "Video", description: "Desc", channelTitle: "Channel", publishedAt: "2024-01-01", tags: ["tag1"] },
            statistics: { viewCount: "1000", likeCount: "100", commentCount: "50" },
            contentDetails: { duration: "PT10M30S" },
          }],
        },
      });

      const result = await service.getVideo("vid123");

      expect(result.title).toBe("Video");
      expect(result.viewCount).toBe("1000");
      expect(result.duration).toBe("PT10M30S");
    });

    it("should throw if video not found", async () => {
      mockVideosList.mockResolvedValue({ data: { items: [] } });

      await expect(service.getVideo("notfound")).rejects.toThrow("Video not found");
    });
  });

  describe("getVideos", () => {
    it("should get multiple videos", async () => {
      mockVideosList.mockResolvedValue({
        data: {
          items: [
            { id: "vid1", snippet: { title: "Video 1" }, statistics: {}, contentDetails: {} },
            { id: "vid2", snippet: { title: "Video 2" }, statistics: {}, contentDetails: {} },
          ],
        },
      });

      const result = await service.getVideos(["vid1", "vid2"]);

      expect(result).toHaveLength(2);
    });
  });

  describe("getChannel", () => {
    it("should get channel by ID", async () => {
      mockChannelsList.mockResolvedValue({
        data: {
          items: [{
            id: "ch123",
            snippet: { title: "Channel", customUrl: "@channel" },
            statistics: { subscriberCount: "1000" },
          }],
        },
      });

      const result = await service.getChannel("ch123");

      expect(result.title).toBe("Channel");
    });

    it("should throw if channel not found", async () => {
      mockChannelsList.mockResolvedValue({ data: { items: [] } });

      await expect(service.getChannel("notfound")).rejects.toThrow("Channel not found");
    });
  });

  describe("listMyPlaylists", () => {
    it("should get user playlists", async () => {
      mockPlaylistsList.mockResolvedValue({
        data: {
          items: [{
            id: "pl123",
            snippet: { title: "My Playlist", description: "Desc" },
            contentDetails: { itemCount: 10 },
          }],
          nextPageToken: "token",
        },
      });

      const result = await service.listMyPlaylists();

      expect(result.playlists).toHaveLength(1);
      expect(result.playlists[0].title).toBe("My Playlist");
    });
  });

  describe("getPlaylist", () => {
    it("should get playlist by ID", async () => {
      mockPlaylistsList.mockResolvedValue({
        data: {
          items: [{
            id: "pl123",
            snippet: { title: "Playlist" },
            contentDetails: { itemCount: 5 },
          }],
        },
      });

      const result = await service.getPlaylist("pl123");

      expect(result.title).toBe("Playlist");
    });

    it("should throw if playlist not found", async () => {
      mockPlaylistsList.mockResolvedValue({ data: { items: [] } });

      await expect(service.getPlaylist("notfound")).rejects.toThrow("Playlist not found");
    });
  });

  describe("getPlaylistItems", () => {
    it("should get playlist items", async () => {
      mockPlaylistItemsList.mockResolvedValue({
        data: {
          items: [{
            id: "item123",
            snippet: { title: "Video in Playlist", position: 0 },
            contentDetails: { videoId: "vid456" },
          }],
          nextPageToken: "token",
        },
      });

      const result = await service.getPlaylistItems("pl123");

      expect(result.items).toHaveLength(1);
      expect(result.items[0].videoId).toBe("vid456");
    });
  });

  describe("listMySubscriptions", () => {
    it("should get user subscriptions", async () => {
      mockSubscriptionsList.mockResolvedValue({
        data: {
          items: [{
            id: "sub123",
            snippet: {
              title: "Subscribed Channel",
              resourceId: { channelId: "ch456" },
              thumbnails: { default: { url: "https://thumb.jpg" } },
            },
          }],
          nextPageToken: "token",
        },
      });

      const result = await service.listMySubscriptions();

      expect(result.channels).toHaveLength(1);
      expect(result.channels[0].title).toBe("Subscribed Channel");
    });
  });

  describe("getVideoComments", () => {
    it("should get video comments", async () => {
      mockCommentThreadsList.mockResolvedValue({
        data: {
          items: [{
            id: "comment123",
            snippet: {
              topLevelComment: {
                snippet: {
                  authorDisplayName: "User",
                  textDisplay: "Great video!",
                  likeCount: 10,
                  publishedAt: "2024-01-01",
                },
              },
            },
          }],
          nextPageToken: "token",
        },
      });

      const result = await service.getVideoComments("vid123");

      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].textDisplay).toBe("Great video!");
    });
  });

  describe("listLikedVideos", () => {
    it("should list liked videos", async () => {
      mockVideosList.mockResolvedValue({
        data: {
          items: [
            { id: "vid1", snippet: { title: "Liked Video" }, statistics: {}, contentDetails: {} },
          ],
          nextPageToken: "token",
        },
      });

      const result = await service.listLikedVideos();

      expect(result.videos).toHaveLength(1);
    });
  });

  describe("rateVideo", () => {
    it("should rate a video", async () => {
      mockVideosRate.mockResolvedValue({});

      await service.rateVideo("vid123", "like");

      expect(mockVideosRate).toHaveBeenCalledWith({
        id: "vid123",
        rating: "like",
      });
    });
  });

  describe("listCaptions", () => {
    it("should list video captions", async () => {
      mockCaptionsList.mockResolvedValue({
        data: {
          items: [
            { id: "cap1", snippet: { language: "en", name: "English", trackKind: "standard" } },
          ],
        },
      });

      const result = await service.listCaptions("vid123");

      expect(result).toHaveLength(1);
      expect(result[0].language).toBe("en");
    });
  });
});
