import express from 'express';
import cors from 'cors';
import redis from 'redis';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

/*
|--------------------------------------------------------------------------
| Redis Setup
|--------------------------------------------------------------------------
*/

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

await redisClient.connect();

console.log('Redis Connected');

/*
|--------------------------------------------------------------------------
| Request Counter Route
|--------------------------------------------------------------------------
*/

app.get('/count', async (req, res) => {
    try {
        const count = await redisClient.get('request_count');

        res.json({ requestCount: count || 0 });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: 'Something went wrong' });
    }
});

/*
|--------------------------------------------------------------------------
| Users Route
|--------------------------------------------------------------------------
*/

app.get('/users', async (req, res) => {
    try {
        const cachedUsers = await redisClient.get('users');

        if (cachedUsers) {
            console.log('CACHE HIT');
            await redisClient.incr('request_count');
            return res.json({ source: 'redis cache', users: JSON.parse(cachedUsers) });
        }

        console.log('CACHE MISS');

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        await redisClient.set('users', JSON.stringify(users), { EX: 60 });
        await redisClient.incr('request_count');

        res.json({ source: 'api', users });

    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

