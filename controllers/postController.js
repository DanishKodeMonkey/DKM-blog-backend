const asyncHandler = require('express-async-handler');
const Posts = require('../models/post');
const { body, validationResult } = require('express-validator');

exports.listPosts = asyncHandler(async (req, res, next) => {
    const allPosts = await Posts.find()
        .sort({ timestamp: 1 })
        .populate('author', 'username')
        .populate({ path: 'comments', select: 'text timestamp' })
        .exec();
    if (allPosts.length === 0) {
        return res.status(404).send('No posts found');
    } else {
        res.send(Object.values(allPosts));
    }
});

exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Posts.findById(req.params.postId).exec();
    if (!post) {
        // no results
        console.error(`Something went wrong, post data: ${post}`);
        console.error(`Errors: ${errors}`);
        const err = new Error('post not found');
        err.status = 404;
        return next(err);
    } else res.send(post);
});

exports.createPost = [
    // validate new post data
    body('title', 'Title must be specified')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Keep titles between 1 and 50 characters')
        .escape(),
    body('text', 'Please provide some text in the post').trim(),
    body('author').notEmpty().escape(),

    // Process request after validation/sanitization
    asyncHandler(async (req, res, next) => {
        // extract errors from request
        const errors = validationResult(req);

        // create new post object with verified data
        const post = new Posts({
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
        });
        if (!errors.isEmpty()) {
            console.error(`Something went wrong, user data: ${user}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('Post create validation failed');
            err.status = 400;
            return next(err);
        } else {
            await post.save();
            return res.send(
                `Post ${req.body.title} has been successfully saved!`
            );
        }
    }),
];

exports.editPost = [
    // validate new post data
    body('title', 'Title must be specified')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Keep titles between 1 and 50 characters')
        .escape(),
    body('text', 'Please provide some text in the post').trim(),
    body('author').notEmpty().escape(),

    // Process request after validation/sanitization
    asyncHandler(async (req, res, next) => {
        // extract errors from request
        const errors = validationResult(req);

        // create new post object with verified data
        const post = new Posts({
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
            // remember _id for post update on DB
            _id: req.params.commentId,
        });
        if (!errors.isEmpty()) {
            console.error(`Something went wrong, user data: ${user}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('Post update validation failed');
            err.status = 400;
            return next(err);
        } else {
            const updatedPost = await Posts.findByIdAndUpdate(
                req.params.postId,
                post,
                {}
            );
            res.send(`Post ${req.body.title} was updated successfully! `);
        }
    }),
];

exports.deletePost = asyncHandler(async (req, res, next) => {
    // TODO
    // Make sure to delete any comments before getting here.

    // for now, just remove the post if it exist.
    const postId = req.params.postId;

    const post = await Posts.findById(postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    await Posts.findByIdAndDelete(postId);
    return res.send('Post has been successfully deleted.');
});
