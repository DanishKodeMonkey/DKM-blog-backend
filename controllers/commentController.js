const asyncHandler = require('express-async-handler');

exports.listComments = asyncHandler(async (req, res, next) => {
    return res.send('Received List Comments HTTP get method');
});

exports.getComment = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received get Comment HTTP get method for comment ID ${req.params.commentId} in post ID ${req.params.postId}`
    );
});

exports.createComment = asyncHandler(async (req, res, next) => {
    return res.send('Received create Comment HTTP get method');
});

exports.editComment = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received edit Comment HTTP get method for comment ID ${req.params.commentId} in post ID ${req.params.postId}`
    );
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received delete Comment HTTP get method for comment ID ${req.params.commentId} in post ID ${req.params.postId}`
    );
});
