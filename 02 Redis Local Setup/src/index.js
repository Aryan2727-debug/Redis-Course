import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
// Creating a new Redis client instance, connecting to Docker container 
// running Redis on localhost at port 6379
const redis = new Redis('redis://localhost:6379');

// Checking Redis connection
app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
});

// Checking MongoDB connection
app.get("/mongo", async (req, res) => {
    const url = "mongodb://localhost:27017/chai_aur_redis";

    if(mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
            res.json({ mongo: "connected", database: mongoose.connection.name });
        } catch (error) {
            res.status(500).json({ mongo: "Failed to connect to MongoDB", error: error.message });
        }
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});