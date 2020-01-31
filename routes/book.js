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

// request for a book ->(member)
router.route('/request-book').post(
  authentication.isMember,
  joiValidator(schema.bookSchema.requestForBook, JOI.property.body),
  BookController.requestForBook,
);

// fetch book requests -> admin/member
router.route('/request-book/:userId').get(
  authentication.isMember,
  BookController.bookRequests,
);


router.route('/request-book/:bookRequestId').patch(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.updateBookRequest, JOI.property.body),
  BookController.updateBookRequest,
);


router.route('/return-book/:userId/:bookId').patch(
  authentication.isAdmin,
  BookController.returnBook,
);

router.route('/book-loans/generate-excel').get(
  authentication.isAdmin,
  BookController.generateBookLoansExcel,
);

router.route('/book-loans/:userId').get(
  authentication.isMember,
  BookController.getBookLoans,
);

module.exports = router;
