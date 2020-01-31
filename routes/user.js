const express = require('express');
const middleware = require('../middleware/index');
const schema = require('../schema/index');
const { JOI } = require('../config/constants');
const uploadImage = require('../utils/utils');

const UserController = require('../controllers/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

router.post('/upload-image/:userId',
  middleware.authentication.isMember,
  uploadImage.single('image'),
  UserController.uploadImage);

router.get('/get-author/:authorId',
  middleware.authentication.isAdmin,
  UserController.getAuthor);

router.post('/create-author',
  middleware.authentication.isAdmin,
  middleware.joiValidator(schema.userSchema.createAuthor, JOI.property.body),
  UserController.createAuthor);

router.patch('/update-author/:authorId',
  middleware.authentication.isAdmin,
  middleware.joiValidator(schema.userSchema.updateAuthor, JOI.property.body),
  UserController.updateAuthor);

router.delete('/delete-author/:authorId',
  middleware.authentication.isAdmin,
  UserController.deleteAuthor);


module.exports = router;
