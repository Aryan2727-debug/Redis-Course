import express from 'express';
import cors from 'cors';
import redis from 'redis';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

await redisClient.connect();

const DEFAULT_EXPIRATION = 3600; // 1 hour

app.get('/photos', async (req, res) => {
    try {
        const photos = await redisClient.get('photos');

        if (photos) {
            console.log('Cache Hit');
            return res.json(JSON.parse(photos));
        }

        console.log('Cache Miss');

        const response = await fetch(
            'https://jsonplaceholder.typicode.com/photos'
        );

        const data = await response.json();

        await redisClient.setEx(
            'photos',
            DEFAULT_EXPIRATION,
            JSON.stringify(data)
        );

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});