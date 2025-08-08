var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const dotenv = require('dotenv');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');

const checkToken = require('./middleware/checkToken');
const limiter = require('./middleware/limiter');

dotenv.config();

const connectDB = require('./config/database');
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

app.use('/users', usersRouter);
app.use('/todos', checkToken, todosRouter);

module.exports = app;
