const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 30 },
    first_name: { type: String, required: true, maxLength: 30 },
    last_name: { type: String, required: true, maxLength: 30 },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    membership: {
        type: String,
        required: true,
        enum: ['User', 'Author'],
        default: 'User',
    },
    password: { type: String, maxLength: 9999 },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
});

UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
});

UserSchema.pre('save', async function (next) {
    console.log('Updating password...');
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Users', UserSchema);
