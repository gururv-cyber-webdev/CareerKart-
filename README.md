# CareerKart – AI-Powered Personalized Career Guidance Platform

CareerKart is a **role-based career guidance web application** that generates **personalized career roadmaps** for students using **AWS Titan (Amazon Bedrock)** and real mentor journeys.  
The platform is designed especially to support **students with constraints such as low marks, rural background, language barriers, and financial limitations**.

---

## ✨ Key Highlights
- AI-generated **A-to-Z career roadmaps**
- Real mentor experiences instead of generic advice
- Role-based access: **Student, Mentor, Admin**
- Built using **MERN stack + AWS AI services**

---

## 🧠 How CareerKart Works
1. Student enters a career goal and constraints (marks, language, finance, etc.)
2. AWS NLP extracts keywords from the query
3. Backend filters relevant mentor journeys from MongoDB
4. AWS Titan (Bedrock) generates a **personalized roadmap**
5. Roadmap is displayed on the frontend

---

## 🏗️ Tech Stack

### Frontend
- React.js
- HTML, CSS
- Axios / Fetch API

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication

### Cloud & AI
- AWS Bedrock (Titan model)
- AWS Comprehend (NLP)
- Amazon S3 (mentor document storage)

---

## 📁 Project Structure
```

careerkart/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md

````

---

## ⚙️ Prerequisites
Ensure the following are installed:
- Node.js (v18+)
- npm
- MongoDB Atlas account
- AWS account with **Bedrock & Comprehend access**
- AWS CLI configured
- Git

---

## 🔧 Backend Setup

### 1️⃣ Navigate to Backend
```bash
cd backend
npm install
````

### 2️⃣ Create Environment File

Create a `.env` file inside `/backend`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region

BEDROCK_MODEL_ID=amazon.titan-tg1-large

JWT_SECRET=your_jwt_secret
```

### 🔐 AWS API Key Explanation

* `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are required to:

  * Call **AWS Bedrock (Titan)** for roadmap generation
  * Use **AWS Comprehend** for keyword extraction
  * Upload mentor documents to **Amazon S3**
* These keys **must never be pushed to GitHub**
* Always keep them inside `.env`

### 3️⃣ Start Backend Server

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup

### 1️⃣ Navigate to Frontend

```bash
cd frontend
npm install
```

### 2️⃣ Create Environment File

Create `.env` inside `/frontend`

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3️⃣ Start Frontend

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔑 API Usage Overview

### Example API Endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/roadmap/generate
POST /api/mentor/register
GET  /api/admin/pending-mentors
```

### Roadmap Generation Flow

* Frontend sends career query + constraints
* Backend calls AWS Comprehend for keyword extraction
* Filtered mentor data is passed to AWS Titan
* Titan returns a structured roadmap response

---

## 🧪 Testing

* Manual testing via UI (student, mentor, admin roles)
* API testing using Postman or Thunder Client
* Check backend logs to verify AWS Titan responses

---
