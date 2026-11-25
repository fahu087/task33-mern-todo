# Task 33: MongoDB, Express.js & React Full-Stack To-Do List App

**Submitted by:** Mohammad Fahad Muzakkir  
**Course:** TuteDude MERN Stack  

---

## Part 1: Express.js & MongoDB REST API (`backend/`)

### Architecture
Follows a modular **Config -> Model -> Service -> Controller -> Routes** structure:
- `config/db.js`: Connects Mongoose to MongoDB Atlas using `MONGO_URI`.
- `models/Task.js`: Defines the `Task` schema (`title`, `description`, `priority`, `completed`, `timestamps`).
- `services/taskService.js`: Encapsulates MongoDB CRUD queries and search/status filtering.
- `controllers/taskController.js`: Validates request payloads and MongoDB ObjectIds, returning structured JSON responses (`200`, `201`, `400`, `404`, `500`).
- `routes/taskRoutes.js`: Exposes `GET`, `POST`, `PATCH`, and `DELETE` routes under `/api/v1/tasks`.

### Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo_app?retryWrites=true&w=majority