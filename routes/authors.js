const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const schema = require('../schema/index');
const { JOI, userType } = require('../config/constants');

const UserController = require('../controllers/user');

const router = express.Router();


router.get('/', (req, res) => {
  res.send({ message: 'Authors route' });
});


// get authors profile
router.get('/get-author/:authorId',
  authentication.isAuthorized(userType.admin, userType.author, userType.member),
  UserController.getAuthor);

// create new author
router.post('/create-author',
  authentication.isAuthorized(userType.admin),
  joiValidator(schema.userSchema.createAuthor, JOI.property.body),
  UserController.createAuthor);

// update author
router.patch('/update-author/:authorId',
  authentication.isAuthorized(userType.admin),
  joiValidator(schema.userSchema.updateAuthor, JOI.property.body),
  UserController.updateAuthor);

// delete author
router.delete('/delete-author/:authorId',
  authentication.isAuthorized(userType.admin),
  UserController.deleteAuthor);


module.exports = router;
