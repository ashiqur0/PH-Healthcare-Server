import app from "./app";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const port = process.env.PORT; // The port your express server will be running on.

const bootstrap = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
}

bootstrap();