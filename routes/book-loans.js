const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const schema = require('../schema/index');
const { JOI, userType } = require('../config/constants');

const router = express.Router();

const BookController = require('../controllers/book');

router.route('/').get((req, res) => res.json({ title: 'Hello world, Welcome to library API' }));

// request for a book ->(member)
router.route('/request-book').post(
  authentication.isAuthorized(userType.admin, userType.member),
  joiValidator(schema.bookSchema.requestForBook, JOI.property.body),
  BookController.requestForBook,
);

// fetch pending book requests -> admin/member
router.route('/request-book/:userId').get(
  authentication.isAuthorized(userType.admin, userType.member),
  BookController.bookRequests,
);

// update requested book
router.route('/request-book/:bookRequestId').patch(
  authentication.isAuthorized(userType.admin),
  joiValidator(schema.bookSchema.updateBookRequest, JOI.property.body),
  BookController.updateBookRequest,
);

// return book
router.route('/return-book/:userId/:bookId').patch(
  authentication.isAuthorized(userType.admin),
  BookController.returnBook,
);

// generate excel sheet for book loans
router.route('/generate-excel').get(
  authentication.isAuthorized(userType.admin),
  BookController.generateBookLoansExcel,
);

// get list of book loans
router.route('/:userId').get(
  authentication.isAuthorized(userType.admin, userType.member),
  BookController.getBookLoans,
);

module.exports = router;
