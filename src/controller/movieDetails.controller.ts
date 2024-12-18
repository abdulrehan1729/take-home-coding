import { Request, Response } from "express";
import axios from "axios";
import { config } from "../config/config";
import { release } from "os";

const urls = {
    discoverMovie: "https://api.themoviedb.org/3/discover/movie",
    movieCredits: "https://api.themoviedb.org/3/movie",
};
const authToken = `Bearer ${config.TMDB_TOKEN}`;
const options = {
    headers: {
        accept: "application/json",
        Authorization: authToken,
    },
};

export const getMoviesByYear = async (req: Request, res: Response) => {
    const { year, page } = req.query;
    const pageNum = page ? page : 1;
    const queryParams = {
        language: "en-US",
        page: pageNum,
        primary_release_year: year,
        sort_by: "popularity.desc",
    };

    try {
        const movieList = await axios.get(urls.discoverMovie, {
            params: queryParams,
            ...options,
        });

        const movieListWithEditors = await Promise.all(
            movieList.data.results.map(async (movie: any) => {
                const editors = await getMovieEditors(movie.id);
                return {
                    title: movie.original_title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors,
                };
            })
        );
        res.status(200).json({ message: "Successfully fetched the movies", data: movieListWithEditors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch movies. Please try again later." });
    }
};

const getMovieEditors = async (movieId: number) => {
    let queryParams = { language: "en-US" };
    try {
        const { data } = await axios.get(`${urls.movieCredits}/${movieId}/credits`, {
            params: queryParams,
            ...options,
        });
        const editors = data.crew
            .filter((person: any) => person.known_for_department === "Editing")
            .map((editor: any) => editor.name);

        return editors;
    } catch (error) {
        console.log(error);
        return [];
    }
};
