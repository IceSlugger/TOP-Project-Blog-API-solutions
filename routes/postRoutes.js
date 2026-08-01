const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postController.createPost
);

// Delete post
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  postController.deletePost
);

module.exports = router;