import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 8080,
    TMDB_TOKEN: process.env.TMDB_TOKEN,
};
