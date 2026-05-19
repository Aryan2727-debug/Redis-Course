import express from 'express';
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

// Key to store the banner message in Redis
const BANNER_KEY = "app:banner";

app.post('/banner', async (req, res) => {
    // Setting a key-value pair in Redis with the banner message
    // Syntax: redis.set(key, value)
    await redis.set(BANNER_KEY, req.body.message || "Welcome to Chai aur Redis!");
    res.json({ success: true });
});

app.get('/banner', async (req, res) => {
    // Getting the banner message from Redis using the key
    // Syntax: redis.get(key)
    const message = await redis.get(BANNER_KEY);
    res.json({ message });
});

app.delete('/banner', async (req, res) => {
    // Deleting the banner message from Redis using the key
    // Syntax: redis.del(key)
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});

app.get('/banner/exists', async (req, res) => {
    // Checking if the banner message exists in Redis using the key
    // Syntax: redis.exists(key)
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});