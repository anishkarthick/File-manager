const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.user, 'destination');
    cb(null, `public/uploads/${req.user._id}`);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf|gif/;
    console.log(filetypes, 'type');
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      callback(null, true);
    } else {
      console.log(`Try another format`);
      callback(null, false);
    }
  },
  limits: { fileSize: 1000000 },
});

module.exports = upload;
