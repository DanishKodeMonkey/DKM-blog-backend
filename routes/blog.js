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
    (req, res, next) => {
        console.log('Route hit: POST /posts');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    post_controller.createPost
);

// edit post
router.put(
    '/posts/:postId',
    (req, res, next) => {
        console.log('Route hit: PUT /posts/:postId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    post_controller.editPost
);

// delete post
router.delete(
    '/posts/:postId',
    (req, res, next) => {
        console.log('Route hit: DELETE /posts/:postId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    post_controller.deletePost
);

// Comments routes
// list all comments on all posts
router.get(
    '/comments',
    (req, res, next) => {
        console.log('Route hit: GET /posts/comments');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    comment_controller.listAllPostsComments
);

// list posts comments
router.get('/posts/:postId/comments', comment_controller.listComments);

// get specific post comment
router.get('/posts/:postId/comments/:commentId', comment_controller.getComment);

// create post comment
router.post(
    '/posts/:postId/comments',
    (req, res, next) => {
        console.log('Route hit: POST /posts/:postId/comments');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    comment_controller.createComment
);

// edit post comment
router.put(
    '/posts/:postId/comments/:commentId',
    (req, res, next) => {
        console.log('Route hit: PUT /posts/:postId/comments/:commentId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    comment_controller.editComment
);

// delete post comment
router.delete(
    '/posts/:postId/comments/:commentId',
    (req, res, next) => {
        console.log('Route hit: DELETE /posts/:postId/comments/:commentId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    comment_controller.deleteComment
);

module.exports = router;
