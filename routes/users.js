const express = require('express');
const { authentication} = require('../middleware/index');
const uploadImage = require('../utils/utils');

const UserController = require('../controllers/user');
const { userType } = require('../config/constants');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

router.get('/get-member/:userId',
  authentication.isAuthorized(userType.admin),
  UserController.getMember);

router.patch('/get-member/:userId',
  authentication.isAuthorized(userType.admin, userType.member),
  UserController.getMember);

// upload admin/member/author image
router.post('/upload-image/:userId',
  authentication.isAuthorized(userType.admin, userType.member),
  uploadImage.single('image'),
  UserController.uploadImage);


module.exports = router;
