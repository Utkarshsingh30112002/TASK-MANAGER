# 🛡️ Task Manager And Auth API

This is a basic Express API built with **Node.js**, **Express**, **Sequelize (PostgreSQL)**, and **Zod** for request validation and task management. It allows users to sign up and sign in, with passwords securely hashed and JWT-based authentication ,After login User can perform basic **CRUD operations**.



---

## 📦 Features

-  User signup with password hashing (`bcrypt`)  
-  User signin with JWT token generation   
-  Input validation using Zod schemas
-  PostgreSQL integration using Sequelize ORM
-  CRUD operation on Tasks using Sequelize ORM
-  Rate Limiting through express-rate-limit module
-  Centralized error handling via middleware 
-  logging via Winston

---

## 📦 Routes

- auth/signup  (POST)
  - username, email, password   required
- auth/signin  (POST)
  - username and password required
- tasks        (POST to create, GET to get all tasks) 
  - accepts query - priority, status, dueDate(date1,date2), sortDueDate, sortPriority
- tasks/:id    (GET - get a task, DELETE - for delete , PUT - for update)

---
## Project Structure
```
.
├── controllers/
├── routes/
├── models/
├── middlewares/
├── services/
├── config/
├── db/
├── zod/
├── app.js
└── README.md
```


