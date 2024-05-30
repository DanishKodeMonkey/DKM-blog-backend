const asyncHandler = require('express-async-handler');

exports.listPosts = asyncHandler(async (req, res, next) => {
    return res.send('Received List Posts HTTP get method');
});

exports.getPost = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received get Post HTTP get method for ${req.params.postId}`
    );
});

exports.createPost = asyncHandler(async (req, res, next) => {
    return res.send('Received create Post HTTP get method');
});

exports.editPost = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received edit Post HTTP get method for ${req.params.postId}`
    );
});

exports.deletePost = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received delete Post HTTP get method for ${req.params.postId}`
    );
});
