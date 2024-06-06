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
console.warn('Starting express app..');
// mongoDB setup and connect
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_URI;
// attempt to start MongoDB operation

console.warn('Setting up mongoose connection...');
main().catch((err) => console.error(err));
async function main() {
    console.log('Connecting to MongoDb...');
    await mongoose.connect(mongoDB);
}
// custom error handler for the API
app.use((err, req, res, next) => {
    console.error('custom error handler triggered');

    if (err.status === 401) {
        // unauthorized error
        res.status(401).json({ error: 'Unauthorized access.' });
    } else {
        res.status(err.status || 500).json({
            status: 'error',
            message: err.message,
        });
    }
});

//middleware
app.use(logger('combined'));
console.log('logger initialised');
app.use(cors());
console.log('cors initialised');
app.use(express.json());
console.log('express json initialised');
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
console.log('passport initialised');

// set up routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);

// catch all route for undefined routes
app.use((req, res, next) => {
    console.error('custom catch all route triggered');
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// custom error handler for the API
app.use((err, req, res, next) => {
    console.error('custom error handler triggered');
    console.error('custom error handler triggered');
    console.error('Request Method:', req.method);
    console.error('Request URL:', req.url);
    console.error('Request Headers:', req.headers);
    console.error('Request Body:', req.body);
    console.error('Query Parameters:', req.query);
    console.error('Authenticated User:', req.user);
    console.error('Error Stack Trace:', err.stack);

    if (err.status === 401) {
        // unauthorized error
        res.status(401).json({ error: 'Unauthorized access.' });
    } else {
        console.error('Error 500 detected');

        res.status(err.status || 500).json({
            status: 'error',
            message: err.message,
        });
    }
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
