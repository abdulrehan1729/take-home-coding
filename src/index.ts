import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "./config/config";
import router from "./routes/router";

const app: Application = express();
const PORT = config.PORT;

app.use(express.json());
app.use("/api", router);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

// Default Route for Undefined Endpoints
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "API endpoint not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}}`);
});
export default app;
