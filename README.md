# Redis learning material, notes and beginner-friendly projects.

## What is Redis?

**Redis (Remote Dictionary Server)** is an open-source, in-memory key-value data store.

Unlike traditional databases that primarily store data on disk, Redis keeps data in memory (RAM), making it extremely fast for read and write operations.

Redis is commonly used alongside databases such as MongoDB, PostgreSQL, and MySQL to improve application performance.

---

## Why Use Redis?

Since Redis stores data in memory, it can respond to requests much faster than traditional databases.

### Without Redis

```text
Client
  │
  ▼
Backend
  │
  ▼
Database
```

Every request hits the database.

---

### With Redis

```text
Client
  │
  ▼
Backend
  │
  ▼
 Redis
  │
  ▼
Database
```

Frequently requested data can be served directly from Redis without querying the database every time.

---

## Common Redis Use Cases

### 1. Caching

The most common Redis use case.

Example:

* User requests product data
* Backend fetches data from database
* Response is stored in Redis
* Future requests use cached data

Benefits:

* Faster response times
* Reduced database load
* Improved scalability

---

### 2. Session Storage

Store user sessions after login.

Example:

```text
session:abc123 → userId:101
```

Used by:

* Express applications
* Next.js applications
* Authentication systems

---

### 3. Rate Limiting

Prevent API abuse.

Example:

```text
user:101 → 100 requests/minute
```

If a user exceeds the limit:

```text
429 Too Many Requests
```

is returned.

---

### 4. Counters and Analytics

Track:

* Page views
* API requests
* Active users
* Video views

Example:

```text
page_views → 15000
```

---

### 5. Real-Time Applications

Used in:

* Chat applications
* Live notifications
* Online gaming
* Activity feeds

---

### 6. Leaderboards

Redis Sorted Sets are ideal for ranking systems.

Example:

```text
1. Aryan - 1200
2. Rahul - 1150
3. Aman - 980
```

Common in:

* Games
* Competitions
* Fitness apps

---

### 7. Job Queues

Store background jobs for asynchronous processing.

Examples:

* Sending emails
* Processing images
* Generating reports
* Payment processing

Popular Node.js libraries:

* BullMQ
* Bee Queue

---

## Redis Data Types

### String

Most commonly used data type.

```bash
SET name Aryan
GET name
```

Output:

```text
Aryan
```

---

### Hash

Similar to a JavaScript object.

```bash
HSET user:1 name Aryan age 24
```

Retrieve:

```bash
HGETALL user:1
```

Output:

```text
name Aryan
age 24
```

---

### List

Ordered collection of values.

```bash
LPUSH tasks "Task 1"
LPUSH tasks "Task 2"
```

Retrieve:

```bash
LRANGE tasks 0 -1
```

---

### Set

Stores unique values.

```bash
SADD skills React
SADD skills Node
SADD skills React
```

Output:

```text
React
Node
```

(No duplicates)

---

### Sorted Set

Stores values with scores.

```bash
ZADD leaderboard 100 Aryan
ZADD leaderboard 90 Rahul
```

Retrieve:

```bash
ZRANGE leaderboard 0 -1 WITHSCORES
```

Useful for leaderboards and rankings.

---

## Essential Redis Commands

### SET

Store a value.

```bash
SET username Aryan
```

---

### GET

Retrieve a value.

```bash
GET username
```

---

### DEL

Delete a key.

```bash
DEL username
```

---

### EXISTS

Check if a key exists.

```bash
EXISTS username
```

Output:

```text
1
```

or

```text
0
```

---

### EXPIRE

Set expiration time.

```bash
EXPIRE username 60
```

Key is deleted after 60 seconds.

---

### TTL

Check remaining time before expiration.

```bash
TTL username
```

Example output:

```text
45
```

seconds remaining.

---

### INCR

Increment a numeric value.

```bash
SET visits 0
INCR visits
```

Result:

```text
1
```

Useful for:

* Counters
* Rate limiting
* Analytics

---

### KEYS

View stored keys.

```bash
KEYS *
```

Example:

```text
users
request_count
session_123
```

---

### FLUSHALL

Delete everything in Redis.

```bash
FLUSHALL
```

⚠️ Use carefully.

---

## Installing Redis on macOS

Install via Homebrew:

```bash
brew install redis
```

Start Redis:

```bash
brew services start redis
```

Verify installation:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

## Connecting Redis in Node.js

Install client:

```bash
npm install redis
```

Example:

```js
import { createClient } from 'redis';

const client = createClient();

await client.connect();

await client.set('name', 'Aryan');

const value = await client.get('name');

console.log(value);
```

Output:

```text
Aryan
```

---

## Redis vs Traditional Databases

| Feature         | Redis             | PostgreSQL/MySQL   |
| --------------- | ----------------- | ------------------ |
| Storage         | Memory            | Disk               |
| Speed           | Extremely Fast    | Fast               |
| Joins           | No                | Yes                |
| Complex Queries | Limited           | Extensive          |
| Caching         | Excellent         | Not Intended       |
| Primary Use     | Performance Layer | Persistent Storage |

---

## When Should You Use Redis?

Use Redis when you need:

* Faster API responses
* Reduced database load
* Session management
* Rate limiting
* Real-time features
* Counters and analytics
* Leaderboards
* Background job processing

Do not use Redis as a complete replacement for a relational database. In most applications, Redis acts as a complementary layer alongside databases such as PostgreSQL, MySQL, or MongoDB.

---

## Quick Summary

Redis is a high-performance in-memory key-value store commonly used for:

* Caching
* Session storage
* Rate limiting
* Real-time applications
* Counters
* Analytics
* Leaderboards
* Job queues

Most frequently used commands:

```bash
SET
GET
DEL
EXISTS
EXPIRE
TTL
INCR
HSET
HGETALL
LPUSH
LRANGE
SADD
ZADD
KEYS
```

For most backend applications, Redis sits between the application server and the primary database, helping deliver faster responses and reducing database load.
