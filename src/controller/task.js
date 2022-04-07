const Task = require('../models/Task');
const mongoose = require('mongoose');
const fs = require('fs');

/*Single imgae upload*/
// const fileUpload = (req, res) => {
//   const file = req.file.path;
//   Task.findOne({ file: file }).then((duplicate) => {
//     if (duplicate) {
//       // alert('File already exists');
//       console.log({ msg: 'File Already exists' });
//       return res.status(400).json({ msg: 'File already exists' });
//     }
//     console.log(file, 'test');
//     try {
//       let task = new Task({
//         ...req.body,
//         owner: req.user._id,
//       });
//       if (req.file) {
//         task.file = req.file.path;
//         task.name = req.file.originalname;
//         task.size = req.file.size;
//       }
//       task.save();
//       res.status(200).json({ msg: 'success' });
//     } catch (error) {
//       res.status(500).json({ msg: 'error' });
//       console.log(error);
//     }
//   });
// };

/*Multiple imgae upload*/
const fileUpload = async (req, res) => {
  //avoid duplicates
  const file = req.files[0];
  if (!file)
    return res.status(404).json({ err: 'notFound', msg: 'File is required' });
  Task.findOne({ file: file.path }).then((duplicate) => {
    if (duplicate) {
      console.log({ msg: 'File Already exists' });
      return res
        .status(400)
        .json({ err: 'duplicate', msg: 'File already exists' });
    }
    console.log(file, 'test');

    try {
      let task;
      console.log(req.files, 'sss');
      let data = [];
      if (req.files) {
        req.files.map((value) => {
          task = new Task({
            name: value.originalname,
            file: value.path,
            size: value.size,
            owner: req.user._id,
          });
          data.push(task);
          console.log(value.filename);
        });
        console.log(data[0], 'data');
      }
      Task.insertMany(data);
      res.status(200).json({ msg: 'success' });
    } catch (error) {
      res.status(500).json({ msg: 'error' });
      console.log(error);
    }
  });
};

const getAll = async (req, res) => {
  try {
    await req.user.populate('tasks');
    res.json({ msg: 'success', data: req.user.tasks });
  } catch (e) {
    res.status(400).json({ msg: 'error' });
    console.log(e);
  }
};

const get = async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).json({ msg: 'success', data: task });
  } catch (error) {
    console.log(error, 'get');
    res.status(500).json({ msg: 'error' });
  }
};

const updateFile = async (req, res) => {
  const fileName = req.file.originalname;
  const filePath = req.file.path;
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
      name: fileName,
      file: filePath,
    });

    fs.unlink(task.file, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });
    await task.save();
    return res.status(200).send({ msg: 'success' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: e.message, msg: 'error' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.body.id,
      owner: req.user._id,
    }); //web

    // const task = await Task.findOneAndDelete({
    //   _id: req.params.id,
    //   owmer: req.user._id,
    // }); //api

    console.log(task.file);
    fs.unlink(task.file, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });

    if (!task) {
      return res.status(404).send();
    }
    res.json({ msg: 'success' });
  } catch (e) {
    res.status(500).json({ msg: 'error' });
    console.log(e);
  }
};

module.exports = { fileUpload, get, getAll, updateFile, deleteFile };

// const _update = (file) => {
//   return new Promise((resolve, reject) => {
//     const { fileName, filePath, id } = file;

//     const local = fs.unlink(filePath);
//     Promise.all([
//       Task.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
//         name: fileName,
//         file: filePath,
//       }),
//       local,
//     ])
//       .then((data) => {
//         resolve('updated!');
//         // resolve({ status: 1, data: data });
//       })
//       .catch((e) => {
//         reject('error');
//         // resolve({ status: 0, data: e });
//       });
//   });
// };

// const updateFile = async (req, res) => {
//   const fileName = req.file.originalname;
//   const filePath = req.file.path;
//   const id = req.params.id;

//   const Filedata = {
//     id,
//     fileName,
//     filePath,
//   };

//   try {
//     await _update(Filedata);
//     // const upfile = async () => {
//     //   Promise.all([local, db])
//     //     .then((values) => {
//     //       console.log(values);
//     //     })
//     //     .catch((e) => {
//     //       console.log(e);
//     //     });
//     // };
//     // upfile();
//     return res.status(200).send({ msg: 'success' });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ err: e.message, msg: 'error' });
//   }
// };
