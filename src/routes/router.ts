import { Router } from "express";
import { getMoviesByYear } from "../controller/movieDetails.controller";
import { getMoviesByYearSchema } from "../middleware/validation/movieDetails.schema";
import { validateRequest } from "../middleware/validation/validate.middleware";

const router = Router();

router.get("/movie-list", validateRequest(getMoviesByYearSchema, "query"), getMoviesByYear);

export default router;
