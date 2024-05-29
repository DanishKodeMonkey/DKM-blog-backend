if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// import package modules
const express = require('express');
const cors = require('cors');

//import routes
const usersRouter = require('./routes/users');
const blogRouter = require('/routes/blog');

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use('/users', usersRouter);
app.use('/blog', blogRouter);

// server setup
if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT, () =>
        console.log(
            `[server]: Server is running at https://localhost:${process.env.PORT}`
        )
    );
}

export default app;
