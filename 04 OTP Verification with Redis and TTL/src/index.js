import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis('redis://localhost:6379');

// function to return the Redis key for storing OTP based on phone number
function otpKey(phoneNumber) {
    return `OTP:${phoneNumber}`;
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    // Store the OTP in Redis with a TTL of 30 seconds
    // Syntax: redis.set(key, value, 'EX', seconds)
    // 'EX' sets the expiration time in seconds for the key
    await redis.set(otpKey(phone), otp, 'EX', 30);
    res.json({ message: 'OTP sent', otp });
});

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    const storedOTP = await redis.get(otpKey(phone));

    if(!storedOTP) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if(storedOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    await redis.del(otpKey(phone)); // Delete the OTP after successful verification
    res.json({ message: 'OTP verified successfully' });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    // Getting the TTL for the OTP associated with the provided phone number
    // Syntax: redis.ttl(key) returns the remaining time to live of a key in seconds
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});