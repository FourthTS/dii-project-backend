import express from 'express';
import { auth } from '../middleware/AuthMiddleware';
import * as controller from '../controllers/postController';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  // storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  },
});

router.post('/add', auth, upload.single('file'), controller.newPost);
router.get('/popular', auth, controller.getPopular);
router.patch('/like', auth, controller.updateLike);

export default router;
