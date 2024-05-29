import express from 'express';
import post_controller from '../controllers/postController';
import comment_controller from '../controllers/commentController';

const router = express.Router();

// Posts routes
// list all posts
router.get('/posts', post_controller.listPosts);

// list specific post
router.get('/posts/:postId', post_controller.getPost);

// create post
router.post('/posts', post_controller.createPost);

// edit post
router.put('/posts/:postId', post_controller.editPost);

// delete post
router.delete('/posts/:postId', post_controller.deletePost);

// Comments routes

// list posts comments
router.get('/posts/:postId/comments', comment_controller.listComments);

// get specific post comment
router.get('/posts/:postId/comments/:commentId', comment_controller.getComment);

// create post comment
router.post('/posts/:postId/comments', comment_controller.createComment);

// edit post comment
router.put(
    '/posts/:postId/comments/:commentId',
    comment_controller.editComment
);

// delete post comment
router.put(
    '/posts/:postId/comments/:commentId',
    comment_controller.deleteComment
);

export default router;
