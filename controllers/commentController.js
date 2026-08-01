const prisma = require('../config/prisma');

async function createComment(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const { content } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized: Please log in again.' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: Number(authorId),
      },
      include: {
        user: { select: { id: true, username: true } }
      }
    });

    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req, res, next) {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const commentAuthorId = comment.userId || comment.authorId;
    if (commentAuthorId !== Number(userId)) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createComment,
  deleteComment,
};