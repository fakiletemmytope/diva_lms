# MINI-LEARNING PLATFORM

This project is the week 3 hands-on project for  the TSI Bootcamp. The aim of the project is to ensure that learning are able to apply backend principles like authentication, authorization and the use of customized middleware to api routes.

### INTRODUCTION

The mini-learning platform is a backend project that have different classes of users and allows all users to view courses available on the platform. The courses are created by the class of users known as the instructors. An instructor can create courses, updated and delete the courses he/she created. An admin has access to all courses and can update or delete a course. The platform also allowed registered users (students) to enroll for courses on the platform.

Each courses have one or more lessons which are created by the course instructor. Only students that are enrolled for a course can view the lessons attached to  the course.

### FEATURES

* **USER AUTHENTICATION**: Secure user authentication with JWT to ensure that authorized usrs can access specific endpoints.
* **CRUD OPERATIONS**: Support for Create, Read, Update, and Delete operations for resources, allowing you to manage data easily and efficiently.
* **COMPREHENSIVE DOCUMENTATION:** Fully documented API endpoints with examples, making it easy for developers to understand how to interact with the API.
* **ERROR HANDLING**: Robust error handling to provide clear feedback and status codes for various failure modes, enhancing the developer experience.

### TECHNOLOGY USED

1. **JWT (Json Web Token)**, it is used for user authentication and authorization.
2. **Argon2**, this is used for hashing the users password before saving to the database.
3. **MongoDb,** this is the database based used for storing the data.
4. **Express**, this is a nodejs based framework that helps to simplifies the development of server-side applications by offering an easy-to-use API for routing, middleware, and HTTP utilities.
5. **Nodejs**, the server environment.

### API Endpoints

| Endpoint                 | Method | Description                                                   |
| ------------------------ | ------ | ------------------------------------------------------------- |
| `/api/users`           | GET    | Retrieve a list of all users.                                 |
| `/api/users/:id`       | GET    | Retrieve detailed information about a specific user by ID.    |
| `/api/users`           | POST   | Create a new user with the provided data.                     |
| `/api/users/:id`       | PUT    | Update the information of a specific user by ID.              |
| `/api/users/:id`       | DELETE | Delete a specific user by ID.                                 |
| `/auth/login`          | POST   | Authenticate a user and return a JWT token.                   |
| `/auth/logout`         | GET    | this logouts out a user and blacklisted the JWT token         |
| `/api/courses`         | GET    | Retrieve a list of all courses.                               |
| `/api/courses`         | POST   | Add a new course with the provided data.                     |
| `/api/courses/:id`     | PUT    | Update the details of a specific course by ID.               |
| `/api/courses/:id`     | DELETE | Remove a specific course by ID.                              |
| `/api/courses/:id`     | GET    | Retrieve the details of a course by ID.                       |
| `/api/lessons/:id`     | GET    | Retrieve detailed information about a specific lesson by ID. |
| `/api/lessons/`        | GET    | Retrieve a list of all lessons.                               |
| `/api/lessons/`        | POST   | Create a lesson                                               |
| `/api/lessons/`:id     | PUT    | Update the details of a specific lesson by ID                 |
| `/api/lessons/`:id     | DELETE | Remove a specific lesson by ID.                              |
| /api/enrollments/        | POST   | To  enrol for a course                                       |
| /api/enrollments/:id     | GET    | Get the details for a specific enrollment by ID               |
| /api/enrollments/        | GET    | Retrieve all enrollments                                      |
| /analytica/lessons       | GET    | returns the data insight for the lessons                      |
| /analytics/users         | GET    | returns the data insight for the users                        |
| /analytics/courses       | GET    | returns the data insight for the courses                      |
| /auth/getactivationtoken | POST   | For generating activation token for registered users          |

### INSTALLATION

```
git clone https://github.com/fakiletemmytope/week4-learning-platform-v1.git
cd week4-learning-platform-v1
npm install
npm start
```

### Documentation

The documentation for the endpoints can be accessed [here](https://documenter.getpostman.com/view/16249004/2sAYdcsCkn)
# diva_lms
# diva_lms
# diva_lms
# diva_lms
