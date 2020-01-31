const express = require('express');
const middleware = require('../middleware/index');
const uploadImage = require('../utils/utils');

const UserController = require('../controllers/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

router.get('/get-member/:userId',
  middleware.authentication.isMember,
  UserController.getMember);

// upload admin/member/author image
router.post('/upload-image/:userId',
  middleware.authentication.isMember,
  uploadImage.single('image'),
  UserController.uploadImage);


module.exports = router;
