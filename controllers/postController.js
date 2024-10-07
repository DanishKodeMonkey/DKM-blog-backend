const asyncHandler = require('express-async-handler');
const { postQueries } = require('../db/prismaQueries');
const { body, validationResult } = require('express-validator');

exports.listPosts = asyncHandler(async (req, res, next) => {
    const allPosts = await postQueries.listPosts();

    if (allPosts.length === 0) {
        return res.status(204).send('No posts found');
    } else {
        res.send(Object.values(allPosts));
    }
});

exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await postQueries.getPost(req.params.postId);

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

        const userId = await postQueries.getUserIdByUsername(req.body.author);

        if (!userId) {
            const err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // create new post object with verified data
        const newPost = await prisma.postQueries.createPost({
            title: req.body.title,
            text: req.body.text,
            authorId: userId,
        });
        if (!errors.isEmpty()) {
            console.error(`Something went wrong, post data: ${post}}`);
            console.error(`Errors: ${errors.array()}`);
            const err = new Error('Post create validation failed');
            err.status = 400;
            return next(err);
        } else {
            return res.send(
                `Post ${newPost.title} has been successfully saved!`
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

        const authorId = await postQueries.getUserIdByUsername(req.body.author);

        if (!authorId) {
            const err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        const updatedData = {
            title: req.body.title,
            text: req.body.text,
            authorId: authorId,
        };

        const updatedPost = await postQueries.editPost({
            postId: parseInt(req.params.postId),
            data: updatedData,
        });

        if (!errors.isEmpty()) {
            console.error(`Something went wrong, post data: ${post}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('Post update validation failed');
            err.status = 400;
            return next(err);
        } else {
            res.send(
                `Post ${updatedPost.data.title} was updated successfully! `
            );
        }
    }),
];

exports.deletePost = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId);

    const post = await postQueries.deletePost(postId);

    return res.send(`${post.title}has been successfully deleted.`);
});
