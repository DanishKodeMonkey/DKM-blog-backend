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
            throw new Error('Failed to update using');
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
    editPost: async ({ postId, data }) => {
        try {
            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    title: data.title,
                    text: data.text,
                    author: data.authorId,
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

module.exports = { userQueries };
