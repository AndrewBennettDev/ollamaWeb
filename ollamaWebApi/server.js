const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        const ollamaResponse = await axios.post(OLLAMA_URL, {
            model: "llama3.2", // change to whatever model you need
            prompt: prompt,
            stream: true
        }, { responseType: "stream" });

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");

        ollamaResponse.data.on("data", (chunk) => {
            const jsonString = chunk.toString();
            try {
                const parsedData = JSON.parse(jsonString);
                if (parsedData.response) {
                    res.write(parsedData.response);
                }
            } catch (error) {
                console.error("Error parsing stream chunk:", error);
            }
        });

        ollamaResponse.data.on("end", () => res.end());

    } catch (error) {
        console.error("Streaming error:", error);
        res.status(500).send("Error processing request");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
