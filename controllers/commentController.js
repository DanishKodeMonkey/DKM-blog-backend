const asyncHandler = require('express-async-handler');
const Comments = require('../models/comment.js');
const Posts = require('../models/post.js');
const { body, validationResult } = require('express-validator');

// Fetches all comments from all posts
exports.listAllPostsComments = asyncHandler(async (req, res, next) => {
    console.warn('Trying to list all posts comments');
    const allPostsComments = await Comments.find()
        .sort({ timestamp: 1 })
        .populate('author', 'username')
        .populate('post', 'title')
        .exec();

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
    const allComments = await Comments.find({ post: req.params.postId })
        .sort({ timestamp: 1 })
        .populate('author', 'username')
        .exec();

    if (allComments.length === 0) {
        return res.status(404).send('No comments found');
    } else {
        res.send(allComments);
    }
});

// fetch specific comment
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comments.findById(req.params.commentId)
        .populate('post', 'title')
        .populate('author', 'username')
        .exec();
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
        const comment = new Comments({
            text: req.body.text,
            post: req.params.postId,
            author: req.body.author,
        });
        if (!errors.isEmpty()) {
            console.error(`Validation errors: ${errors.array()}`);
            return res.status(400).json({ errors: errors.array() });
        } else {
            await comment.save();

            // update comment array of post
            await Posts.findByIdAndUpdate(
                req.params.postId,
                { $push: { comments: comment._id } },
                { new: true }
            );
            return res.status(204).send(`Comment has been successfully saved!`);
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
        const comment = new Comments({
            text: req.body.text,
            post: req.params.postId,
            author: req.body.author,
            // remember _id for comment update on DB
            _id: req.params.commentId,
        });
        if (!errors.isEmpty()) {
            console.error(`Validation errors: ${errors.array()}`);
            return res.status(400).json({ errors: errors.array() });
        } else {
            const updatedComment = await Comments.findByIdAndUpdate(
                req.params.commentId,
                comment,
                {}
            );
            res.send('Comment was successfully updated');
        }
    }),
];
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    console.log(commentId, ' found');
    const comment = await Comments.findById(commentId);

    if (!comment) {
        console.error('Error, comment not found', commentId, comment);
        return res.status(404).send('Comment not found');
    }
    await Comments.findByIdAndDelete(commentId);
    return res.send('Comment has been successfully deleted');
});
