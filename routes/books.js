const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const schema = require('../schema/index');
const { JOI, userType } = require('../config/constants');

const router = express.Router();

const BookController = require('../controllers/book');


// fetch book list, admin/member can access this route
router.route('/').get(
  authentication.isAuthorized(userType.admin, userType.member),
  BookController.getBooks,
);

// create new book
router.route('/').post(
  authentication.isAuthorized(userType.admin, userType.author),
  joiValidator(schema.bookSchema.createBook, JOI.property.body),
  BookController.createBook,
);

// update boook
router.route('/:bookId').patch(
  authentication.isAuthorized(userType.admin, userType.author),
  joiValidator(schema.bookSchema.updateBook, JOI.property.body),
  BookController.updateBook,
);

// delete a book with bookId
router.route('/:bookId').delete(
  authentication.isAuthorized(userType.admin, userType.author),
  joiValidator(schema.bookSchema.deleteBook, JOI.property.params),
  BookController.deleteBook,
);

module.exports = router;
