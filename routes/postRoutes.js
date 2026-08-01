const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', passport.authenticate('jwt', { session: false }), postController.createPost);

module.exports = router;