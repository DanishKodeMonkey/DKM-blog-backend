const { listComments } = require('../controllers/commentController');
const prisma = require('./prismaClient');

const userQueries = {
    createUser: async ({
        username,
        first_name,
        last_name,
        email,
        password,
        membership,
    }) => {
        try {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    first_name,
                    last_name,
                    email,
                    password,
                    membership,
                },
            });
            return newUser;
        } catch (err) {
            console.error('Error creating user: ', err);
            throw new Error('Error creating user');
        }
    },
    editUser: async (userId, updateData) => {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(userId) },
                data: updateData,
            });
            return updatedUser;
        } catch (err) {
            console.error('Error updating user data; ', err);
            throw new Error('Failed to update user');
        }
    },
    deleteUser: async (userId) => {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id: parseInt(userId) },
            });
            return deletedUser;
        } catch (err) {
            console.error('Error deleting user: ', err);
            throw new Error('Error deleting user');
        }
    },
    listUsers: async () => {
        try {
            const allUsers = await prisma.user.findMany({
                orderBy: { username: 'asc' },
            });
            return allUsers;
        } catch (err) {
            console.error('Error fetching users: ', err);
            throw new Error('Error fetching users');
        }
    },
    getUser: async (userId) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
                include: {
                    posts: { select: { title: true, timestamp: true } },
                    comments: { select: { text: true, timestamp: true } },
                },
            });
            return user;
        } catch (err) {
            console.error('Error fetching user by id: ', err);
            throw new Error(' Error fetching user by id');
        }
    },
};

const postQueries = {
    getUserIdByUsername: async (username) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username },
                select: { id: true },
            });
            return user ? user.id : null;
        } catch (err) {
            console.log('Error fetching userId', err);
            throw new Error('Error fetching userId');
        }
    },
    listPosts: async () => {
        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            username: true,
                        },
                    },
                    comments: {
                        select: {
                            text: true,
                            timestamp: true,
                            author: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    timestamp: 'desc',
                },
            });
            return posts;
        } catch (err) {
            console.error('Error fetching all posts', err);
            throw new Error('Error fetching all posts');
        }
    },
    getPost: async (postId) => {
        try {
            const post = prisma.post.findUnique({
                where: { id: parseInt(postId) },
                include: {
                    author: {
                        select: {
                            username: true,
                        },
                    },
                    comments: {
                        select: {
                            text: true,
                            timestamp: true,
                            author: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            return post;
        } catch (err) {
            console.error('Error fetching post: ', err);
            throw new Error('Error fetching post');
        }
    },
    createPost: async ({ title, text, authorId }) => {
        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    text,
                    authorId,
                },
            });
            return post;
        } catch (err) {
            console.error('Error creating post: ', err);
            throw new Error('Error creating post');
        }
    },
    editPost: async ({ postId, title, text, authorId }) => {
        try {
            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    title: title,
                    text: text,
                    userId: authorId,
                },
            });
            return updatedPost;
        } catch (err) {
            console.error('Error updating post: ', err);
            throw new Error('Error updating post');
        }
    },
    deletePost: async (postId) => {
        try {
            const deletedPost = await prisma.post.delete({
                where: { id: postId },
            });
            return deletedPost;
        } catch (err) {
            console.error('Error deleting post: ', err);
            throw new Error('Error deleting post.');
        }
    },
};

const commentQueries = {
    listAllPostsComments: async () => {
        try {
            const postsAndComments = await prisma.comment.findMany({
                orderBy: { timestamp: 'asc' },
                include: {
                    author: { select: { username: true } },
                    post: {
                        select: { title: true },
                    },
                },
            });
            return postsAndComments;
        } catch (err) {
            console.error('Error fetching all posts comments: ', err);
            throw new Error('Error fetching comments for posts');
        }
    },
    listComments: async (postId) => {
        try {
            const postComments = await prisma.comment.findMany({
                where: { postId: postId },
                orderBy: { timestamp: 'asc' },
                include: { author: { select: { username: true } } },
            });
            return postComments;
        } catch (err) {
            console.error('Error fetching all comments: ', err);
            throw new Error('Error fetching comments');
        }
    },
    getComment: async (commentId) => {
        try {
            const comment = await prisma.comment.findUnique({
                where: { id: commentId },
                include: {
                    post: { select: { title: true } },
                    author: { select: { username: true } },
                },
            });
            return comment;
        } catch (err) {
            console.error('Error fetching comment: ', err);
            throw new Error('Error fetching comment');
        }
    },
    createComment: async ({ text, postId, authorId }) => {
        try {
            const newComment = await prisma.comment.create({
                data: {
                    text: text,
                    postId: postId,
                    userId: authorId,
                },
            });
            return newComment;
        } catch (err) {
            console.error('Error creating comment: ', err);
            throw new Error('Error creating comment');
        }
    },
    editComment: async ({ commentId, text, postId, authorId }) => {
        try {
            const updatedComment = await prisma.comment.update({
                where: { id: commentId },
                data: {
                    text: text,
                    postId: postId,
                    userId: authorId,
                },
            });
            return updatedComment;
        } catch (err) {
            console.error('Error updating comment: ', err);
            throw new Error('Error updating comment');
        }
    },
    deleteComment: async (commentId) => {
        try {
            const deletedComment = await prisma.comment.delete({
                where: { id: commentId },
            });
            return deletedComment;
        } catch (err) {
            console.error('Error deleting comment: ', err);
            throw new Error('Error deleting comment');
        }
    },
};

module.exports = { userQueries, postQueries, commentQueries };
