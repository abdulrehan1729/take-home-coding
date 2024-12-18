import express, { Application } from "express";
import { config } from "./config/config";
import router from "./routes/router";

const app: Application = express();
const PORT = config.PORT;

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}}`);
});
