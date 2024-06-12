const express = require('express');
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const passport = require('../config/passport');

const isAuthorized = require('../middleware/isAuthorized');

const router = express.Router();

// Posts routes
// list all posts
router.get('/posts', post_controller.listPosts);

// list specific post
router.get('/posts/:postId', post_controller.getPost);

// create post
router.post(
    '/posts',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    post_controller.createPost
);

// edit post
router.put(
    '/posts/:postId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    post_controller.editPost
);

// delete post
router.delete(
    '/posts/:postId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    post_controller.deletePost
);

// Comments routes
// list all comments on all posts
router.get('/posts/comments', comment_controller.listAllPostsComments);

// list posts comments
router.get('/posts/:postId/comments', comment_controller.listComments);

// get specific post comment
router.get('/posts/:postId/comments/:commentId', comment_controller.getComment);

// create post comment
router.post(
    '/posts/:postId/comments',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    comment_controller.createComment
);

// edit post comment
router.put(
    '/posts/:postId/comments/:commentId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    comment_controller.editComment
);

// delete post comment
router.delete(
    '/posts/:postId/comments/:commentId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    comment_controller.deleteComment
);

module.exports = router;
