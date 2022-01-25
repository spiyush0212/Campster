const mongoose = require('mongoose');

const campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;