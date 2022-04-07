const User = require('../models/User');
const sendConfirmationEmail = require('../config/nodemailer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const verificationCode = uuidv4();

const get = async (req, res) => {
  res.json('welcome');
  console.log('welcome');
};

const register = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmationCode: verificationCode,
  });

  // todo validation
  try {
    await user.save();
    const path = `./public/uploads/${user._id}`;

    fs.access(path, (error) => {
      if (error) {
        fs.mkdir(path, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log('New Directory created successfully !!');
          }
        });
      } else {
        console.log('Given Directory already exists !!');
      }
    });

    res.status(201).json({
      message: 'User was registered successfully! Please check your email',
    });
    sendConfirmationEmail(user.name, user.email, user.confirmationCode);
  } catch (e) {
    res.status(400).json({ msg: 'error' });
    console.log(e, 'ERROR');
  }
};

const verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      user.status = 'Active';
      res.sendFile(path.join(__dirname, '../../public', 'confirm.html'));
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log('error', e));
};

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // console.clear();
    console.log(user);
    res.cookie('auth_token', token);
    res.json({ user, token });
  } catch (e) {
    // console.clear();
    console.log(e);
    res.status(400).json(e);
    console.log(e, 'ERROR in controller');
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).json({ msg: 'success' });
    // res.send({ msg: 'User loged out successfully' });
  } catch (e) {
    res.status(500).json(e);
    console.log(e, 'ERROR');
  }
};

const logoutall = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    // res.send({ msg: 'All user loged out successfully' });
    res.status(200).json({ msg: 'success' });
  } catch (e) {
    res.status(500).json(e);
    console.log(e, 'ERROR');
  }
};

module.exports = { verifyUser, get, register, login, logout, logoutall };
