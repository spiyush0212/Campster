const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if (err)
            console.log(err);
        else {
            console.log('Removed all campgrounds');
            Comment.deleteMany({}, (err) => {
                if (err)
                    console.log(err);
                else
                    console.log('Deleted all comments');
            })
        }
    })
}

module.exports = seedDB;