import { Router } from "express";
import { getMoviesByYear } from "../controller/movieDetails.controller";

const router = Router();

router.get("/movie-list", getMoviesByYear);

export default router;
