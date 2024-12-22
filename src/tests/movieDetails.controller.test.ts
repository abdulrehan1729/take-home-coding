import request from "supertest";
import app from "../index"; // Assuming your app is exported from here
import axios from "axios";

jest.mock("axios"); // Mock axios to simulate the API responses

// Typing axios as jest.Mock to access mock methods like mockResolvedValueOnce
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GET /api/movie-list", () => {
    const mockDiscoverMoviesResponse = {
        data: {
            results: [
                {
                    id: 1,
                    original_title: "Inception",
                    release_date: "2010-07-16",
                    vote_average: 8.8,
                },
                {
                    id: 2,
                    original_title: "Interstellar",
                    release_date: "2014-11-07",
                    vote_average: 8.6,
                },
            ],
        },
    };

    const mockMovieCreditsResponse = {
        data: {
            crew: [
                { name: "Joe Editor", known_for_department: "Editing" },
                { name: "Another Crew", known_for_department: "Directing" },
            ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Reset the mocks before each test
    });

    it("should fetch movies by year and return them with editors", async () => {
        // Mocking the API responses
        mockedAxios.get
            .mockResolvedValueOnce(mockDiscoverMoviesResponse) // Mock discover movie API
            .mockResolvedValueOnce(mockMovieCreditsResponse) // Mock movie credits for Inception
            .mockResolvedValueOnce(mockMovieCreditsResponse); // Mock movie credits for Interstellar

        const response = await request(app).get("/api/movie-list?year=2010&page=1");

        // Assert that the response status is 200 and the response data matches the expected format
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully fetched the movies");
        expect(response.body.data).toEqual([
            {
                title: "Inception",
                release_date: "2010-07-16",
                vote_average: 8.8,
                editors: ["Joe Editor"], // Editors should be populated
            },
            {
                title: "Interstellar",
                release_date: "2014-11-07",
                vote_average: 8.6,
                editors: ["Joe Editor"], // Editors should be populated
            },
        ]);
    });

    it("should handle movie credits API failure gracefully", async () => {
        // Mocking the discover movie API response
        mockedAxios.get
            .mockResolvedValueOnce(mockDiscoverMoviesResponse) // Mock discover movie API
            .mockRejectedValueOnce(new Error("Movie credits API failed")); // Simulate failure in movie credits API

        const response = await request(app).get("/api/movie-list?year=2010&page=1");

        // Assert that editors array is empty for movies whose credits failed to fetch
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully fetched the movies");
        expect(response.body.data).toEqual([
            {
                title: "Inception",
                release_date: "2010-07-16",
                vote_average: 8.8,
                editors: [], // Editors should be empty if API fails
            },
            {
                title: "Interstellar",
                release_date: "2014-11-07",
                vote_average: 8.6,
                editors: [], // Editors should be empty if API fails
            },
        ]);
    });

    it("should return 500 if the discover movies API fails", async () => {
        // Simulate failure in the discover movies API
        mockedAxios.get.mockRejectedValueOnce(new Error("Discover movies API failed"));

        const response = await request(app).get("/api/movie-list?year=2010&page=1");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to fetch movies. Please try again later.");
    });

    it("should use the default page number if no page query is provided", async () => {
        // Mocking the API responses
        mockedAxios.get
            .mockResolvedValueOnce(mockDiscoverMoviesResponse) // Mock discover movie API
            .mockResolvedValueOnce(mockMovieCreditsResponse) // Mock movie credits for Inception
            .mockResolvedValueOnce(mockMovieCreditsResponse); // Mock movie credits for Interstellar

        const response = await request(app).get("/api/movie-list?year=2010"); // No page query

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully fetched the movies");
    });

    it("should use the provided page query", async () => {
        // Mocking the API responses
        mockedAxios.get
            .mockResolvedValueOnce(mockDiscoverMoviesResponse) // Mock discover movie API
            .mockResolvedValueOnce(mockMovieCreditsResponse) // Mock movie credits for Inception
            .mockResolvedValueOnce(mockMovieCreditsResponse); // Mock movie credits for Interstellar

        const response = await request(app).get("/api/movie-list?year=2010&page=2"); // Providing page query

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully fetched the movies");
    });
});
