const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinary');

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [{width: 300, height: 300, crop: "limit"}]
    }
});

const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 600, height: 600, crop: "limit" }]
    }
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadProduct = multer({ storage: productStorage });

module.exports = { uploadAvatar, uploadProduct };