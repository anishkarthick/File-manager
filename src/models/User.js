const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userId = uuidv4();

//User model
const UserSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: userId,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Enter a valid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending'],
    default: 'Pending',
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

//connects both user and task
UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

//generatNe token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'secretCodeForJWT');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//check user and password
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  try {
    if (!user) {
      throw new Error(
        JSON.stringify({ status: 400, msg: 'Please check the email' })
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('please check the password');
    }
    if (user.status != 'Active') {
      console.log(user.status);
      throw new Error('Pending Account. Please Verify Your Email!');
    }

    return user;
  } catch (e) {
    console.log(e, 'error in model');
  }
};

// hash the plaintext password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
