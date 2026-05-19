import Redis from 'ioredis';

// creating a new Redis client instance for the subscriber
const subscriber = new Redis('redis://localhost:6379'); 

// subscribing to the 'notifications' channel
subscriber.subscribe('notifications', (err) => {
    if (err) {
        console.error('Failed to subscribe: %s', err.message);
        return;
    } 
    console.log('Subscribed successfully!');
});

// listening for messages on the subscribed channel
subscriber.on('message', (channel, message) => {
    console.log('Received data on channel:', channel, ':', JSON.parse(message));
});