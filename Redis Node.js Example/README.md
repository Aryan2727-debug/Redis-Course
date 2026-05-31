# Redis + Node.js Caching Example

A simple Express.js application demonstrating how to use Redis as a cache layer for API responses.

## Tech Stack

* Node.js
* Express.js
* Redis
* CORS
* Fetch API

## What This Application Does

The application exposes a single endpoint:

```http
GET /photos
```

When the endpoint is called:

1. Check Redis for a cached value using the key `photos`.
2. If data exists in Redis:

   * Return the cached data.
   * Log `Cache Hit`.
3. If data does not exist in Redis:

   * Fetch data from JSONPlaceholder.
   * Store the response in Redis with a TTL of 1 hour.
   * Return the response.
   * Log `Cache Miss`.

This pattern helps reduce external API calls and improve response times.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Start Redis

### macOS (Homebrew)

Start Redis service:

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

## Start the Application

Run:

```bash
node server.js
```

Expected output:

```text
Server is running on port 3000
```

---

## Validate Using Postman

### Request

```http
GET http://localhost:3000/photos
```

### First Request

Expected console output:

```text
Cache Miss
```

Reason:

* Data is fetched from the external API.
* Data is stored in Redis.

### Second Request

Expected console output:

```text
Cache Hit
```

Reason:

* Data is served directly from Redis.
* No external API call is made.

---

## Validate Redis Cache

Open Redis CLI:

```bash
redis-cli
```

Check if the key exists:

```bash
KEYS *
```

Expected output:

```text
1) "photos"
```

View cached data:

```bash
GET photos
```

Check remaining TTL:

```bash
TTL photos
```

Example output:

```text
3542
```

This indicates the cache will expire in 3542 seconds.

---

## Clear Cache

Delete the cached key:

```bash
DEL photos
```

Verify:

```bash
KEYS *
```

Expected output:

```text
(empty list or set)
```

The next API request will result in a `Cache Miss`.

---

## Redis Commands Used

| Command | Purpose                     |
| ------- | --------------------------- |
| GET     | Retrieve cached value       |
| SETEX   | Store value with expiration |
| TTL     | Check remaining expiry time |
| DEL     | Delete cache key            |
| KEYS *  | View all keys               |

---

## Cache Expiration

Current cache duration:

```js
const DEFAULT_EXPIRATION = 3600;
```

This means cached data remains valid for:

```text
3600 seconds = 1 hour
```
