# 📝 Blog Platform — Full Stack Project

A feature-rich blogging platform built with **React + Tailwind CSS** on the frontend and **Spring Boot** on the backend. It supports JWT-based authentication, post creation with tags and categories, commenting, liking, and even AI-assisted content generation using Python.

---

## 📦 Tech Stack

### 🚀 Backend (Spring Boot)
- Spring Boot (REST API)
- Spring Security + JWT Authentication
- H2 Database (File-based persistence)
- DTOs for clean data transfer
- JPA (Hibernate) + Repository pattern
- Maven
- Python Integration for AI content generation
- Unit, Integration, and Controller Testing:
  - JUnit 5, Mockito, MockMvc, Spring Boot Test

### 💻 Frontend (React)
- React (CRA)
- Tailwind CSS
- Axios (API calls)
- React Router DOM
- State management with hooks
- Custom components for:
  - Blog List, Create/Edit Blog
  - Tags, Categories
  - Comments, Likes
  - Post Summary toggle (client-side only)

---

## ✨ Key Features

- 🔐 JWT-based user authentication
- ✍️ Create/Edit/Delete blog posts
- 🏷️ Categorize & tag posts
- 💬 Commenting on posts
- ❤️ Like system
- 🔎 Filter & Search posts by category/tag
- 🧠 AI-Generated content support via Python
- 🧪 Comprehensive test suite (unit + integration)
- 🐳 Docker-ready with CI/CD pipeline (GitHub Actions YAML included)

---

## ⚙️ Running the Application

### 🧠 Backend (Spring Boot)

```bash
# From the root of the backend repo
mvn clean install
mvn spring-boot:run
```

- Runs at: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`  
  - JDBC URL: `jdbc:h2:file:./data/blogdb`
  - Username: `sa`
  - Password: `password`

> ✅ Note: The project uses a file-based H2 DB for persistence across restarts.

---

### 🌐 Frontend (React)

```bash
# From the frontend folder
npm install
npm start
```

- Opens at: `http://localhost:3000`

---

🧠 AI Integration

The backend connects to a Python-based FastAPI microservice that enhances blogging productivity using NLP techniques.
Features provided:

    ✂️ Summarization — Condenses long content into 1–2 key sentences.

    🏷️ Tag Generation — Suggests relevant tags using spaCy (Named Entity Recognition + POS tagging).

Tech Stack:

    FastAPI + spaCy + NLTK
    Deployed separately, CORS-enabled for React frontend
    Endpoints:
        POST /summarize
        POST /generate-tags
        POST /generate

    🚀 Note: The microservice runs independently and should be started before interacting with AI features in the blog.

To start the service:
  uvicorn main:app --reload

---


## 🧪 Testing Overview

| Type         | Framework          | Coverage                             |
|--------------|--------------------|--------------------------------------|
| Unit Tests   | JUnit 5 + Mockito  | Service-layer logic                  |
| Integration  | Spring Boot Test   | Full-stack behavior with real beans |
| Repository   | Spring Data JPA    | Query methods + persistence          |
| REST API     | MockMvc            | Controller layer + response testing |

Run all tests:

```bash
mvn test
```

---

## ⚙️ CI/CD & Docker Support

- GitHub Actions YAML configured for Maven + Docker
- **Not deployed** to cloud (e.g., EC2) yet
- You can build and run locally using Docker:

```bash
docker build -t blog-platform .
docker run -p 8080:8080 blog-platform
```

---

## 👨‍💻 Developer Notes

- AI was used extensively to generate boilerplate code, test templates, and improve productivity.
- The architecture is modular and testable, making it easy to extend (e.g., add notifications, markdown editor, etc.)
- Ideal as a personal portfolio or demo for microservice-to-monolith evolution.

---

## 📁 Folder Structure

```
├── blog-backend/
│   ├── src/main/java/...
│   ├── src/test/java/...
│   └── Dockerfile
├── blog-frontend/
│   ├── src/components/
│   ├── src/pages/
│   └── public/
```

---

## 🧭 Roadmap Ideas
- [ ] Deploy to EC2 using GitHub Actions
- [ ] Role-based access control (Admin, Author, Reader)
- [ ] Profile page + user bio
- [ ] Post scheduling & drafts
- [ ] Markdown editor support

---

## 📜 License

This project is for demo/portfolio purposes.  
Feel free to fork, contribute, or take inspiration!

---

<img width="1376" height="894" alt="image" src="https://github.com/user-attachments/assets/bd1400ad-d6fe-443f-82cc-62eae4c11445" />

<img width="1390" height="901" alt="image" src="https://github.com/user-attachments/assets/bd62d8b7-9974-431f-b148-b542750e570a" />

<img width="1382" height="943" alt="image" src="https://github.com/user-attachments/assets/7c243e95-7a13-4c90-800e-a324f784b76b" />

<img width="1348" height="526" alt="image" src="https://github.com/user-attachments/assets/73b7a02e-6129-47f2-8938-dc9de2c62002" />


