require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const { create } = require('lodash');
const logger = require('morgan');
const app = express();
const indexRouter = require('./routes/index');
const cors = require('cors');

app.disable('etag');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add routes here
app.use('/', indexRouter);

//error handlers
app.use(function (req, res, next) {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({errors: err});
})


module.exports = app;