require('./config/mongoose');
const express = require('express');
const path = require('path');
const $ = require('jquery');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.redirect('/users/login');
  // res.cookie('name', 'express').send('cookie set'); //Sets name = express//check cookie console.log(document.cookie)
});

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

//path for jquery file to be used from the node_module jquery package
const modulePath = path.join(__dirname, '../node_modules/jquery/dist/');
app.use('/jquery', express.static(modulePath));

app.use(userRouter);
app.use(taskRouter);

//default page load
// Login Page
app.get('/users/login', (req, res) =>
  res.sendFile(path.join(__dirname, '../public', 'login.html'))
);
// Register Page
app.get('/users/register', (req, res) =>
  res.sendFile(path.join(__dirname, '../public', 'register.html'))
);
//Dashboard
app.get('/users', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
