// Endpoints required:
// POST -> /post/:id/view -> increments view count for a post
// POST -> /leaderboard/score -> add points to a user's score
// GET -> /leaderboard -> get the top 10 users in the leaderboard
// GET -> /leaderboard/:userid/rank -> get the rank of a user in the leaderboard

// Redis functions to use:
// i) incr -> to increment the view count of a post
// ii) zincrby -> to add points to a user's score in the leaderboard
// iii) zrevrange -> to get the top 10 users in the leaderboard
// iv) zrevrank -> to get the rank of a user in the leaderboard 

import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6379');

const POST_VIEWS_KEY = 'post_views';
const LEADERBOARD_KEY = 'leaderboard';

app.post('/post/:id/view', async (req, res) => {
    const postId = req.params.id;
    // Increment the view count for the post in Redis
    // Syntax: redis.incr(key)
    await redis.incr(`${POST_VIEWS_KEY}:${postId}`);
    res.send(`View count for post ${postId} incremented.`);
});

app.post('/leaderboard/score', async (req, res) => {
    const { userId, points } = req.body;
    // Add points to the user's score in the leaderboard in Redis
    // Syntax: redis.zincrby(key, increment, member)
    await redis.zincrby(LEADERBOARD_KEY, points, userId);
    res.send(`Added ${points} points to user ${userId}'s score.`);
});

app.get('/leaderboard', async (req, res) => {
    // Get the top 10 users in the leaderboard from Redis
    // Syntax: redis.zrevrange(key, start, stop, 'WITHSCORES')
    const topUsers = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, 'WITHSCORES');
    res.json(topUsers);
});

app.get('/leaderboard/:userId/rank', async (req, res) => {
    const userId = req.params.userId;
    // Get the rank of the user in the leaderboard from Redis
    // Syntax: redis.zrevrank(key, member)
    const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);
    if (rank !== null) {
        res.send(`User ${userId} is ranked #${rank + 1} in the leaderboard.`);
    } else {
        res.send(`User ${userId} is not ranked in the leaderboard.`);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});