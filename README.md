# Task Manager API

A RESTful backend API for managing personal tasks, with secure user authentication, image upload support via AWS S3, and deployment to AWS Lambda using the Serverless Framework.

---

## Features

- ✅ JWT-based authentication (`/auth/signup`, `/auth/login`)
- ✅ Role-based access control (`admin`, `user`)
- ✅ Task ownership and authorization
- ✅ Image upload using S3 presigned URLs
- ✅ Serverless deployment (AWS Lambda + API Gateway)
- ✅ Clean, modular structure with TypeScript & Express

---

## Tech Stack

- **Node.js** + **TypeScript**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **AWS S3** for file storage
- **Serverless Framework** for deployment
- **Jest** for testing

---

## API Endpoints

### Auth

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| POST   | /auth/signup | Create user account      |
| POST   | /auth/login  | Log in user & return JWT |

### User

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| GET    | /user/me             | Get current user's info (auth required) |
| PATCH  | /user/updatePassword | Update user's password (auth required)  |
| GET    | /user/allUsers       | Get all users (admin only)              |

### Tasks

| Method | Endpoint        | Description                           |
| ------ | --------------- | ------------------------------------- |
| GET    | /tasks/allTasks | Get user's all tasks (owner or admin) |
| GET    | /tasks/:id      | Get a task                            |
| POST   | /tasks          | Create a new task (auth required)     |
| PUT    | /tasks/\:id     | Update a task (owner or admin)        |
| DELETE | /tasks/\:id     | Delete a task (owner or admin)        |
| DELETE | /tasks/         | Delete all tasks (admin)              |

### Files

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | /files/presign | Get S3 presigned URL for file upload |

---

## Auth & Authorization

- JWT-based stateless authentication.
- Tokens returned in JSON response bodies.
- Middleware checks:

  - If user is logged in
  - If user owns the task or has admin rights

---

## S3 Upload Flow

1. **Client** requests a presigned URL via `POST /files/presign`
2. **Client** uploads the file directly to S3 using the `uploadUrl`
3. **Client** submits the public file URL in the task creation or update request

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas cluster
- AWS S3 bucket
- AWS IAM user with S3 permissions

### Environment Variables

Create a `.env` file:

```env
DATABASE=<your MongoDB connection string>
PORT=3000
JWT_SECRET=<secure_jwt_secret>
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
AWS_ACCESS_KEY=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
AWS_BUCKET_NAME=<your_s3_bucket>
```

### Install & Run Locally

```bash
npm install
npm run dev
```

---

## Run Testing

```bash
npm test
```

---

## 🚀 Deployment

This app is deployed to **AWS Lambda** using the **Serverless Framework**:

```bash
npx serverless deploy
```

- All endpoints are routed via **API Gateway (HTTP API)**
- Environment is configured via `.env` + `serverless.yml`
- Images stored in S3 with `public-read` ACL
