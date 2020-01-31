const express = require('express');
const middleware = require('../middleware/index');
const schema = require('../schema/index');
const { JOI } = require('../config/constants');

const UserController = require('../controllers/user');

const router = express.Router();


router.get('/', (req, res) => {
  res.send({ message: 'Authors route' });
});


// get authors profile
router.get('/get-author/:authorId',
  middleware.authentication.isMember,
  UserController.getAuthor);

// create new author
router.post('/create-author',
  middleware.authentication.isAdmin,
  middleware.joiValidator(schema.userSchema.createAuthor, JOI.property.body),
  UserController.createAuthor);

// update author
router.patch('/update-author/:authorId',
  middleware.authentication.isAdmin,
  middleware.joiValidator(schema.userSchema.updateAuthor, JOI.property.body),
  UserController.updateAuthor);

// delete author
router.delete('/delete-author/:authorId',
  middleware.authentication.isAdmin,
  UserController.deleteAuthor);


module.exports = router;
