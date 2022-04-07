const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const taskController = require('../controller/task');

// router.post(
//   '/fileUpload',
//   auth,
//   upload.single('file'),
//   taskController.fileUpload
// );

router.post(
  '/fileUpload',
  auth,
  upload.array('file'),
  taskController.fileUpload
);
router.get('/getFile/:id', auth, taskController.get);

router.get('/getAllFile', auth, taskController.getAll);

router.delete('/deleteFile/:id', auth, taskController.deleteFile);

router.patch(
  '/updateFile/:id',
  auth,
  upload.single('file'),
  taskController.updateFile
);

module.exports = router;
