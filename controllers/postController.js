const prisma = require('../config/prisma');

async function getAllPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
}


async function getPostById(req, res, next) {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, username: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);

  } catch (err) {
    next(err);
  }
}


async function createPost(req, res, next) {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(authorId),
      }
    });

    res.status(201).json(newPost);

  } catch (err) {
    next(err);
  }
}


// DELETE POST
async function deletePost(req, res, next) {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }


    // Only allow the author to delete
    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'You can only delete your own posts'
      });
    }


    await prisma.post.delete({
      where: {
        id: postId
      }
    });


    res.json({
      message: 'Post deleted successfully'
    });


  } catch (err) {
    next(err);
  }
}


module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
};