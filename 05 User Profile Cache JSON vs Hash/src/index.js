import express from 'express';
import Redis from 'ioredis'; 

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6379');

// Technique 1: Store user profile as JSON string
app.post('/user/:id/json', async (req, res) => {
    // Here, the data is stored as a string inside the DB, which is not ideal
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ savedAs: 'json' });
});

// Getting user profile stored as JSON string
app.get('/user/:id/json', async (req, res) => {
    const rawData = await redis.get(`user:${req.params.id}:json`);
    // We will need to JSON.parse the string back to an object before sending it in the response
    res.json({ user: rawData ? JSON.parse(rawData) : null });
});

// Technique 2: Store user profile as Redis hash
app.post('/user/:id/hash', async (req, res) => {
    // Setting multiple fields in the hash using HSET
    // Syntax: redis.hset(key, field1, value1, field2, value2, ...)
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ savedAs: 'hash' });
});

// Getting user profile stored as Redis hash
app.get('/user/:id/hash', async (req, res) => {
    // Get all fields and values of the hash using HGETALL
    // Syntax: redis.hgetall(key)
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    // We don't need to parse anything here since HGETALL returns an object with field-value pairs
    res.json({ user });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});