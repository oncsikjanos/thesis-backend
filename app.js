var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var loadEnvironment = require('./loadEnvironment.js')
const Database = require('./db/conn.js');
const Firebase = require('./db/firebase.js');
const { validateCookieJWT } = require('./validation/cookieJWTValidator.js');
const { validateAdmin } = require('./validation/adminJWTValidator.js');

var addUserRouter = require('./routes/user/addUser.js');
var getUserRouter = require('./routes/user/getUser.js');
var loginRouter = require('./routes/auth/login.js');
var registerRouter = require('./routes/auth/register.js');
var logoutRouter = require('./routes/auth/logout.js');
var addTestRouter = require('./routes/test/addTest.js')
var updateUserRouter = require('./routes/user/updateUser.js')
var createInitialTest = require('./routes/test/createInitialTest.js');
var addQuestion = require('./routes/question/addQuestion.js')
var getQuestion = require('./routes/question/getQuestion.js')
var updateQuestion = require('./routes/question/updateQuestion.js')
var deleteQuestion = require('./routes/question/deleteQuestion.js')
var addQuestionPicture = require('./routes/question/addQuestionPicture.js')
var deleteQuestionPicture = require('./routes/question/deleteQuestionPicture.js')
var getTestsInProgress = require('./routes/test/getTestsInProgress.js')
var getTest = require('./routes/test/getTest.js')
var updateTest = require('./routes/test/updateTest.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true            
}));;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/addUser', addUserRouter);
app.use('/getUser', validateCookieJWT, getUserRouter);
app.use('/updateUser', validateCookieJWT, updateUserRouter)

app.use('/addQuestion', validateAdmin, addQuestion);
app.use('/getQuestion', validateAdmin, getQuestion);
app.use('/updateQuestion', validateAdmin, updateQuestion);
app.use('/deleteQuestion', validateAdmin, deleteQuestion);
app.use('/addQuestionPicture', validateAdmin, addQuestionPicture);
app.use('/deleteQuestionPicture', validateAdmin, deleteQuestionPicture);

app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.use('/addTest', validateAdmin, addTestRouter);
app.use('/createInitialTest', createInitialTest);
app.use('/getTestsInProgress',  validateAdmin ,getTestsInProgress);
app.use('/getTest', validateAdmin, getTest)
app.use('/updateTest', validateAdmin, updateTest)
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

Database.init();
Firebase.init();

module.exports = app;