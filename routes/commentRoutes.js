const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const commentController = require('../controllers/commentController');

router.post('/', passport.authenticate('jwt', { session: false }), commentController.createComment);
router.delete('/:commentId', passport.authenticate('jwt', { session: false }), commentController.deleteComment);

module.exports = router;