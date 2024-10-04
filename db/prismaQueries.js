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

module.exports = { userQueries };
