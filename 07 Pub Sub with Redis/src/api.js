import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
// creating a new Redis client instance for the publisher
const publisher = new Redis('redis://localhost:6379');

// API endpoint to publish notifications
app.post('/notifications', async (req, res) => {
    // collecting the notification data from the request body
    const payload = {
        title: req.body.title,
        createdAt: new Date().toISOString()
    };

    // publishing the notification to the 'notifications' channel
    const receivers = await publisher.publish('notifications', JSON.stringify(payload));
    res.json({ message: `Notification sent to ${receivers} subscribers!` });
});

app.listen(3000, () => {
    console.log('API server is running on http://localhost:3000');
});