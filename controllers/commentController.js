const asyncHandler = require('express-async-handler');
const { commentQueries } = require('../db/prismaQueries');
const { body, validationResult } = require('express-validator');

// Fetches all comments from all posts
exports.listAllPostsComments = asyncHandler(async (req, res, next) => {
    console.warn('Trying to list all posts comments');
    const allPostsComments = await commentQueries.listAllPostsComments();

    if (allPostsComments.length === 0) {
        console.error('No comments found');
        return res.status(404).send('No comments found');
    } else {
        console.log('Success, sending all posts comments');
        res.send(allPostsComments);
    }
});

// Fetches all comments associated to a given post
exports.listComments = asyncHandler(async (req, res, next) => {
    const postId = parseInt(req.params.postId);
    const allComments = await commentQueries.listComments(postId);

    if (allComments.length === 0) {
        return res.status(404).send('No comments found');
    } else {
        res.send(allComments);
    }
});

// fetch specific comment
exports.getComment = asyncHandler(async (req, res, next) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await commentQueries.getComment(commentId);
    if (!comment) {
        // no result
        const err = new Error('Comment not found');
        err.status = 404;
        return next(err);
    } else res.send(comment);
});

exports.createComment = [
    // validate new comment data
    body('text', 'Please provide some text to comment')
        .trim()
        .isLength({ min: 1, max: 600 })
        .withMessage('Keep text between 1 and 600 characters')
        .escape(),
    body('author').notEmpty().escape(),

    // process request after validation/sanitization
    asyncHandler(async (req, res, next) => {
        // extract errors from request
        const errors = validationResult(req);

        // create new comment object with verified data

        if (!errors.isEmpty()) {
            console.error(`Validation errors: ${errors.array()}`);
            return res.status(400).json({ errors: errors.array() });
        } else {
            const { text, authorId } = req.body;
            const postId = parseInt(req.params.postId);
            const newComment = await commentQueries.createComment({
                text,
                postId,
                authorId,
            });

            if (newComment) {
                return res
                    .status(201)
                    .send(`Comment has been successfully saved!`);
            } else {
                throw new Error('Failed to save comment');
            }
        }
    }),
];

exports.editComment = [
    // validate new comment data
    body('text', 'Please provide some text to comment')
        .trim()
        .isLength({ min: 1, max: 600 })
        .withMessage('Keep text between 1 and 600 characters')
        .escape(),
    body('author').notEmpty().escape(),

    // process request after validation/sanitization
    asyncHandler(async (req, res, next) => {
        // extract errors from request
        const errors = validationResult(req);

        // create new comment object with verified data
        if (!errors.isEmpty()) {
            console.error(`Validation errors: ${errors.array()}`);
            return res.status(400).json({ errors: errors.array() });
        } else {
            const { text, authorId } = req.body;
            const postId = parseInt(req.params.postId);
            const commentId = parseInt(req.params.commentId);

            const updatedComment = await commentQueries.editComment({
                commentId,
                text,
                postId,
                authorId,
            });
            if (updatedComment) {
                res.status(200).send('Comment was successfully updated');
            } else {
                throw new Error('Failed to update comment');
            }
        }
    }),
];
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const commentId = parseInt(req.params.commentId);

    const deletedComment = await commentQueries.deleteComment({ commentId });

    if (deletedComment) {
        res.status(200).send('Comment has been successfully deleted');
    } else {
        console.error('Error, comment not found');
        res.status(404).send('Comment not found');
    }
});
