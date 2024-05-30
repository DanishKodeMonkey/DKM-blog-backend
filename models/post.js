const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 50 },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    author: { type: Schema.Types.ObjectId, ref: 'Users' },
    published: { type: Boolean, default: true },
});

PostSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model('Posts', PostSchema);
