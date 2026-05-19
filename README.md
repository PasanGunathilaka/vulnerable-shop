# Vulnerable Shop - Setup Guide

## Purpose

This project is an intentionally vulnerable e-commerce training application created for the Senior Engineer Security Session.

Participants will use this app to identify, document, and fix common OWASP Top 10 vulnerabilities.

> Important: This application is intentionally insecure. Run it only locally for training. Do not deploy it to a public server.

---

## Pre-requisites

- Docker Desktop
- Git
- Web browser

That is enough. Node.js, npm, and PostgreSQL run inside Docker.

Optional:

- VS Code
- Postman or Insomnia

---

## Project Services

The application runs using Docker Compose with three services:

| Service | Technology | URL / Port |
|---|---|---|
| Frontend | React + Vite | `http://localhost:5173` |
| Backend API | Node.js + Express | `http://localhost:5000` |
| Database | PostgreSQL | `localhost:5433` |

---

## Clone the Project

Clone the repository:

```bash
git clone https://github.com/PasanGunathilaka/vulnerable-shop.git
```

Go into the project folder:

```bash
cd vulnerable-shop
```


---

## Run the Project

Make sure Docker Desktop is running.

From the root project folder, run:

```bash
docker compose up --build
```

This command will:

- Build the frontend container
- Build the backend container
- Start the PostgreSQL database
- Seed the database with sample data
- Start the full application

---

## Open the Application

After the containers start successfully, open this URL in your browser:

```text
http://localhost:5173
```

Backend API health check:

```text
http://localhost:5000
```

If the backend is running correctly, you should see:

```json
{
  "message": "Vulnerable Shop API is running"
}
```

---

## Test Login Accounts

Use these test users:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `12345` |
| User | `user1@test.com` | `12345` |
| User | `user2@test.com` | `12345` |

---

## Stop the Project

To stop the running containers, press:

```text
Ctrl + C
```

Then run:

```bash
docker compose down
```

---

## Reset the Database

Use this when you want to remove all database data and reload the original sample data.

```bash
docker compose down -v
```

Then start again:

```bash
docker compose up --build
```

---

## Common Docker Commands

Start the app:

```bash
docker compose up --build
```

Stop the app:

```bash
docker compose down
```

Reset database fully:

```bash
docker compose down -v
docker compose up --build
```

View running containers:

```bash
docker ps
```

View all logs:

```bash
docker compose logs
```

View backend logs only:

```bash
docker compose logs backend
```

View frontend logs only:

```bash
docker compose logs frontend
```

View database logs only:

```bash
docker compose logs postgres
```

---

## Installing Extra npm Packages

You do not need Node.js or npm installed locally. Use npm inside the Docker containers.

Install a backend package:

```bash
docker compose exec backend npm install helmet
```

Install multiple backend packages:

```bash
docker compose exec backend npm install helmet express-rate-limit bcrypt joi
```

Install a frontend package:

```bash
docker compose exec frontend npm install dompurify
```

After installing packages, rebuild the project:

```bash
docker compose down
docker compose up --build
```

---

## Session Task

Your job is to act as a security reviewer.

You need to:

1. Run the application
2. Explore the frontend and backend behavior
3. Identify security vulnerabilities
4. Document findings before fixing them
5. Fix at least six important vulnerabilities
6. Add or document test cases for your fixes
7. Prepare the required security reports

---

## Vulnerabilities to Discover

This application intentionally includes several security issues, including:

- SQL injection in product search
- XSS in product reviews
- Broken access control on order endpoints
- Insecure direct object references
- Missing rate limiting
- Weak password policy
- Session fixation vulnerability
- Information disclosure in error responses

There may also be other related security weaknesses.

---

## Required Deliverables

At the end of the challenge, prepare these files:

```text
{your-name}-month4-audit.md
{your-name}-month4-fixes/
{your-name}-month4-pentest.md
{your-name}-month4-checklist.md
```

---

## Important Reminder

This project is intentionally vulnerable.

Do not:

- Deploy it publicly
- Use real passwords
- Use real customer data
- Connect it to production systems

Use it only for local training and learning.