# Redis User Cache Demo

A simple full-stack application demonstrating how Redis can be used as a caching layer between a frontend application and an external API.

## Overview

This project consists of:

* A React frontend
* A Node.js + Express backend
* A Redis cache

The application fetches user data from a public API and stores the response in Redis. Subsequent requests are served directly from Redis until the cache expires.

This demonstrates one of the most common real-world Redis use cases: **API response caching**.

---

## Architecture

```text
React Frontend
       │
       ▼
Node.js + Express Backend
       │
       ▼
      Redis
       │
       ▼
External API
(jsonplaceholder.typicode.com)
```

### Request Flow

#### First Request (Cache Miss)

```text
Frontend
    │
    ▼
Backend
    │
    ▼
Redis Cache
    │
    ▼
Cache Miss
    │
    ▼
External API
    │
    ▼
Store Response in Redis
    │
    ▼
Return Data to Frontend
```

#### Subsequent Requests (Cache Hit)

```text
Frontend
    │
    ▼
Backend
    │
    ▼
Redis Cache
    │
    ▼
Cache Hit
    │
    ▼
Return Cached Data
```

---

## Features

* Fetches user data from a public API
* Stores API responses in Redis
* Automatically expires cached data after 60 seconds
* Tracks the number of requests served
* Displays whether data was returned from:

  * External API
  * Redis Cache
* Demonstrates cache hit and cache miss scenarios

---

## Technologies Used

### Frontend

* React
* Fetch API
* CSS

### Backend

* Node.js
* Express
* Redis Client
* CORS

### Cache Layer

* Redis

---

## Redis Concepts Demonstrated

### GET

Retrieve data from Redis.

```js
const cachedUsers = await redisClient.get('users');
```

### SET

Store data in Redis.

```js
await redisClient.set(
  'users',
  JSON.stringify(users)
);
```

### TTL (Time To Live)

Automatically expire cached data after 60 seconds.

```js
await redisClient.set(
  'users',
  JSON.stringify(users),
  {
    EX: 60
  }
);
```

### INCR

Increment a counter value.

```js
await redisClient.incr('request_count');
```

---

## API Endpoints

### GET /users

Returns user data.

#### Cache Miss

* Fetches data from external API
* Stores response in Redis
* Returns fresh data

#### Cache Hit

* Returns cached data directly from Redis

Example response:

```json
{
  "source": "redis",
  "users": [...]
}
```

---

### GET /count

Returns the total number of requests served.

Example response:

```json
{
  "requestCount": 12
}
```

---

## Running the Project

### Start Redis

```bash
brew services start redis
```

Verify Redis is running:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

### Start Backend

```bash
cd backend
node server.js
```

Expected output:

```text
Redis Connected
Server running on 3001
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Testing Redis Caching

### First Request

Click **Fetch Users**.

Backend logs:

```text
CACHE MISS
```

Data is fetched from the external API and stored in Redis.

---

### Second Request

Click **Fetch Users** again.

Backend logs:

```text
CACHE HIT
```

Data is served directly from Redis.

---

### Cache Expiration

After 60 seconds:

```text
Redis automatically removes cached data
```

The next request will again result in:

```text
CACHE MISS
```

---

## Useful Redis Commands

View all keys:

```bash
redis-cli
KEYS *
```

Get cached users:

```bash
GET users
```

Check remaining TTL:

```bash
TTL users
```

Get request count:

```bash
GET request_count
```

Delete cache manually:

```bash
DEL users
```

---

## Learning Outcomes

This project demonstrates:

* Redis installation and setup
* Connecting a Node.js application to Redis
* Implementing API response caching
* Cache hit vs cache miss behavior
* Using Redis TTL for automatic cache invalidation
* Maintaining counters with Redis
* Integrating Redis into a full-stack application

It serves as a beginner-friendly introduction to Redis and lays the foundation for more advanced topics such as session storage, rate limiting, Pub/Sub messaging, and background job processing.
