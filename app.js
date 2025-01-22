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

/* User related routes */
var addUserRouter = require('./routes/user/addUser.js');
var getUserRouter = require('./routes/user/getUser.js');
var loginRouter = require('./routes/auth/login.js');
var registerRouter = require('./routes/auth/register.js');
var logoutRouter = require('./routes/auth/logout.js');
var updateUserRouter = require('./routes/user/updateUser.js')
var getUsers = require('./routes/user/getUsers.js')
var makeAdmin = require('./routes/user/makeAdmin.js')
var makeStudent = require('./routes/user/makeStudent.js')
var setResult = require('./routes/result/setResult.js')

/* Test related routes */
var addTestRouter = require('./routes/test/addTest.js')
var createInitialTest = require('./routes/test/createInitialTest.js');
var getTestsInProgress = require('./routes/test/getTestsInProgress.js')
var getTest = require('./routes/test/getTest.js')
var updateTest = require('./routes/test/updateTest.js');
var getAppliableTest = require('./routes/test/getAppliableTest.js');
var deleteTest = require('./routes/test/deleteTest.js');
var applyToTest = require('./routes/test/applyToTest.js');
var cancelTestApplication = require('./routes/test/cancelTestApplication.js');
var getSubjects = require('./routes/test/getSubjects.js');
var finalizeTest = require('./routes/test/finalizeTest.js');
var getMyExams = require('./routes/test/getMyExams.js');
var canTakeTest = require('./routes/test/canTakeTest.js');
var getTeacherExams = require('./routes/test/getTeacherExams.js');
var startTest = require('./routes/test/startTest.js');
var finishTest = require('./routes/test/finishTest.js');
var attendVideoChat = require('./routes/test/attendVideoChat.js');

/* Question related routes */
var addQuestion = require('./routes/question/addQuestion.js')
var getQuestion = require('./routes/question/getQuestion.js')
var updateQuestion = require('./routes/question/updateQuestion.js')
var deleteQuestion = require('./routes/question/deleteQuestion.js')
var addQuestionPicture = require('./routes/question/addQuestionPicture.js')
var deleteQuestionPicture = require('./routes/question/deleteQuestionPicture.js')
var getExamQuestions = require('./routes/question/getExamQuestions.js')


/* Answer */
var saveAnswer = require('./routes/answer/saveAnswer.js')
var loadAnswer = require('./routes/answer/loadAnswer.js')

/* Result */
var getResult = require('./routes/result/getResult.js')
var getUnValuatedResults = require('./routes/result/getUnValuatedResults.js')

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

app.use('/addUser', addUserRouter); /* deprecated */
app.use('/getUser', validateCookieJWT, getUserRouter);
app.use('/updateUser', validateCookieJWT, updateUserRouter);
app.use('/getUsers', validateAdmin, getUsers)
app.use('/makeAdmin', validateAdmin, makeAdmin)
app.use('/makeStudent', validateAdmin, makeStudent)
app.use('/setResult', validateAdmin, setResult)

app.use('/addQuestion', validateAdmin, addQuestion);
app.use('/getQuestion', validateAdmin, getQuestion);
app.use('/updateQuestion', validateAdmin, updateQuestion);
app.use('/deleteQuestion', validateAdmin, deleteQuestion);
app.use('/addQuestionPicture', validateAdmin, addQuestionPicture);
app.use('/deleteQuestionPicture', validateAdmin, deleteQuestionPicture);
app.use('/getExamQuestions', validateCookieJWT, getExamQuestions);
app.use('/saveAnswer', validateCookieJWT, saveAnswer);
app.use('/loadAnswer', validateCookieJWT, loadAnswer);

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

app.use('/addTest', validateAdmin, addTestRouter);
app.use('/createInitialTest', validateAdmin, createInitialTest); /* add validation */
app.use('/getTestsInProgress',  validateAdmin ,getTestsInProgress);
app.use('/getTest', validateAdmin, getTest)
app.use('/updateTest', validateAdmin, updateTest)
app.use('/getAppliableTest', validateCookieJWT, getAppliableTest) /* add validation */
app.use('/deleteTest', validateAdmin, deleteTest)
app.use('/applyToTest', validateCookieJWT, applyToTest)
app.use('/cancelTestApplication', validateCookieJWT, cancelTestApplication)
app.use('/getSubjects',validateCookieJWT, getSubjects)
app.use('/finalizeTest',validateAdmin, finalizeTest)
app.use('/getmyExams', validateCookieJWT, getMyExams)
app.use('/getTeacherExams', validateAdmin, getTeacherExams)
app.use('/canTakeTest', validateCookieJWT, canTakeTest)
app.use('/startTest', validateCookieJWT, startTest)
app.use('/finishTest', validateCookieJWT, finishTest)
app.use('/attendVideoChat', validateCookieJWT, attendVideoChat)

app.use('/getResult', validateCookieJWT, getResult)
app.use('/getUnValuatedResults', validateAdmin, getUnValuatedResults)

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