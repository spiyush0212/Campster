const Campground = require('../models/campground'),
    Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        req.flash('error', 'You must be logged in to perform this action!');
        res.redirect('/login');
    }
};

middlewareObj.checkCampAuth = (req, res, next) => {
    const campId = req.params.id;
    Campground.findById(campId, (err, doc) => {
        if (err)
            return err;
        const authId = doc.author.id.toString();
        const userId = req.user._id.toString();
        if (authId === userId)
            next();
        else {
            req.flash('error', 'You are not authorised to perform this action!')
            res.redirect('/campgrounds/' + campId);
        }
    });
}

middlewareObj.checkCommentAuth = (req, res, next) => {
    const campId = req.params.id;
    const comId = req.params.comid;
    console.log(`comment id = ${comId}`)
    Comment.findById(comId, (err, doc) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Unable to perform the action due to internal error');
            res.redirect('back');
        }
        console.log('Doc = ' + doc);
        const authId = doc.author.id.toString();
        const userId = req.user._id.toString();
        if (authId == userId)
            next();
        else {
            req.flash('error', 'You are not authorised to perform this action!')
            res.redirect('/campgrounds/' + campId);
        }
    });
}

module.exports = middlewareObj;