const multer = require('multer');
// let upload = multer({ dest: 'uploads/' });


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadImage = multer({ storage });

module.exports = uploadImage;
