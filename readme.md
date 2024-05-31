# A backend REST API for handling blog posts, comments and user accounts and authorization

## Made using Javascript, NodeJS, Express, Passport, bcrypt, mongoose and more

The API here is originally intended for my own purposes to support a upcoming blog. It offers a great foundational endpoint for managing the CRUD operations a blog could need.

This is a Node.js application designed to provide a backend RESTful API for a blog platform. The application handles, and enables easy user authentication, blog post management, and comment management. It uses MongoDB as the database, with mongoose as the ODM(Object Data Modeling) library. Passport.js is used for authentication, supporting both local and JWT strategies.

## Project Structure

The project is structured into several directories and files, each serving a specific purpose.

-   **config/**: Contains a pre-configured passport module.
-   **controllers/**: Houses the controller files that define the business logic for the different routes.
-   **middleware/** : Holds the custom middleware used for authorization checks on routes.
-   **models/**: Defines Mongoose schemas for the applications data models.
-   **app.js**: The main application file that sets up the express server and middleware.

## Features

-   User authentication and authorization using JWT and Passport.js
-   CRUD operations for users, blog posts, and comments
-   Validation and sanitization of input data
-   Secure password hashing with bcrypt
-   Middleware for route protection

## Environment Variables

The application relies on the following environment variables, typically set in a .env file for local development:

-   **NODE_ENV**: The environment in which the application is running (e.g., development or production).
-   **JWT_SECRET**: Secret key used for signing JWT tokens.
-   **MONGO_URI**: Connection string for the MongoDB database.
-   **PORT**: Port number on which the server will listen.

## Authentication

Passport Configuration (config/passport.js)

The application uses Passport.js for authentication, supporting both local strategy and JWT strategy.

-   **Local Strategy**: Used for username and password authentication. It verifies the user credentials against the stored hashed password.
-   **JWT Strategy**: Used for securing API routes. It verifies the JWT token provided in the Authorization header.

## Routes

### Authentication Routes (routes/auth.js)

-   **POST /auth/sign-in**: Handles user sign-in.

### User Routes (routes/user.js)

-   **GET /users**: Lists all users (secured).
-   **GET /users/**:userId: Retrieves a specific user by ID (secured).
-   **POST /users**: Creates a new user.
-   **PUT /users/**:userId: Updates an existing user (secured).
-   **DELETE /users/**:userId: Deletes a user (secured).

### Blog Routes (routes/blog.js)

#### Post Routes

-   **GET /posts**: Lists all posts.
-   **GET /posts/:postId**: Retrieves a specific post by ID.
-   **POST /posts**: Creates a new post (secured).
-   **PUT /posts/:postId**: Updates an existing post (secured).
-   **DELETE /posts/:postId**: Deletes a post (secured).

#### Comment Routes

-   **GET /posts/:postId/comments**: Lists all comments for a specific post.
-   **GET /posts/:postId/comments/:commentId**: Retrieves a specific comment by ID.
-   **POST /posts/:postId/comments**: Creates a new comment (secured).
-   **PUT /posts/:postId/comments/:commentId**: Updates an existing comment (secured).
-   **DELETE /posts/:postId/comments/:commentId**: Deletes a comment (secured).

## Conclusion

DKM Blog Backend provides a robust foundation for managing users, blog posts, and comments, with secure authentication and authorization mechanisms. The project structure and code organization facilitate easy maintenance and scalability.
