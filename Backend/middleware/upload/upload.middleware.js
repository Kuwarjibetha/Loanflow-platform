const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'loan-tracking-docs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({ storage });

module.exports = upload;
