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
        validate: {
            validator: function (v) {
                return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    membership: {
        type: String,
        required: true,
        enum: ['User', 'Author'],
        default: 'User',
    },
    password: { type: String, required: true, minLength: 4, maxLength: 9999 },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
});

UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Users', UserSchema);
