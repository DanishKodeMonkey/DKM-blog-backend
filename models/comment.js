const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    post: { type: Schema.Types.ObjectId, ref: 'Posts' },
    author: { type: Schema.Types.ObjectId, ref: 'Users' },
});

CommentSchema.virtual('url').get(function () {
    return `/comments/${this._id}`;
});

module.exports = mongoose.model('Posts', UserSchema);
