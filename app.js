if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// import package modules
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
// pre-configured passport module
const passport = require('./config/passport');
//import routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

const app = express();
// mongoDB setup and connect
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_URI;
// attempt to start MongoDB operation

main().catch(err => console.error(err));
async function main() {
    await mongoose.connect(mongoDB);
}
//middleware
app.use(logger('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// set up routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);

// catch all route for undefined routes
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// custom error handler for the API
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message,
    });
});

// server setup
if (process.env.NODE_ENV === 'development') {
    app.listen(process.env.PORT, () =>
        console.log(
            `[server]: Server is running at https://localhost:${process.env.PORT}`
        )
    );
}

module.exports = app;
