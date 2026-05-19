import express, { raw } from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6379');

const QUEUE_KEY = 'queue:emails';

app.post('/emails', async (req, res) => {
    // creating an email job object with the required fields
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No Body',
        createdAt: new Date().toISOString()
    };

    // pushing the job to the Redis list (queue) as a JSON string
    // Syntax: redis.lpush(queueKey, jobData)
    // lpush adds the job to the left end of the list, making it a FIFO queue
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued: true, job });
});

app.get('/emails/process-one', async (req, res) => {
    // popping a job from the Redis list (queue)
    // Syntax: redis.rpop(queueKey)
    // rpop removes and returns the last element of the list, which is the oldest job in the queue
    const rawJob = await redis.rpop(QUEUE_KEY);
    if(!rawJob) {
        return res.json({ processed: false, message: 'No jobs in the queue' });
    }

    const job = JSON.parse(rawJob);
    res.json({ message: 'Email sent', job });
});

app.listen(3000, () => {
    console.log('Email queue server is running on port 3000');
});