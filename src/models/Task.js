const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'file',
    },
    file: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
