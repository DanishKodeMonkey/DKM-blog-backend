if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// import package modules
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

//import routes
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

module.exports = app;
