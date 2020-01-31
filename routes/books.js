const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const schema = require('../schema/index');
const { JOI } = require('../config/constants');

const router = express.Router();

const BookController = require('../controllers/book');

router.route('/').get((req, res) => res.json({ title: 'Hello world, Welcome to library API' }));

// fetch book list, admin/member can access this route
router.route('/:pageNo').get(
  authentication.isMember,
  BookController.getBooks,
);

// create new book
router.route('/').post(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.createBook, JOI.property.body),
  BookController.createBook,
);

// update boook
router.route('/:bookId').patch(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.updateBook, JOI.property.body),
  BookController.updateBook,
);

// delete a book with bookId
router.route('/:bookId').delete(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.deleteBook, JOI.property.params),
  BookController.deleteBook,
);

module.exports = router;
