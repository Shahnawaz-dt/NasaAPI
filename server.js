import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.static("public"));

app.get("/api/apod", async (req, res) => {
    try {
        const apiKey = process.env.NASA_KEY;
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to load APOD" });
    }
});

app.listen(3000, () => console.log("NASA APOD running on http://localhost:3000"));
