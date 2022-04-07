const { redirect } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies['auth_token'] ||
      req.header('Authorization').replace('Bearer ', '');
    // const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token);
    const decoded = jwt.verify(token, 'secretCodeForJWT');
    // console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    // res.status(401).json({ error: 'Please authenticate.' });
    res.redirect('/users/login');
    console.log(e);
  }
};
module.exports = auth;
