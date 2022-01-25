// ===================
// DEPENDANCIES
// ===================

const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

// ===================
// ROUTES
// ===================

router.get('/new', middleware.loggedIn, (req, res) => {
    const campId = req.params.id;
    Campground.findOne({ _id: campId }, (err, doc) => {
        if (err)
            console.log(err);
        else
            res.render('comments/new', { campground: doc });
    });
});

router.post('/', middleware.loggedIn, (req, res) => {
    const campId = req.params.id;
    Campground.findOne({ _id: campId }, (err, docCampground) => {
        if (err)
            console.log(err);
        else {
            const newComment = req.body.comment;
            newComment.author = {
                id: req.user._id,
                username: req.user.username
            };
            Comment.create(newComment, (err, docComment) => {
                if (err)
                    console.log(err);
                else {
                    docCampground.comments.push(docComment);
                    docCampground.save();
                    req.flash('success', 'Comment saved!')
                    res.redirect('/campgrounds/' + docCampground._id);
                }
            });
        }
    });
});

router.get('/:comid/edit', middleware.loggedIn, middleware.checkCommentAuth, (req, res) => {
    const campId = req.params.id;
    const comId = req.params.comid;
    Campground.findById(campId, (err, docCamp) => {
        if (err)
            console.log(err);
        else {
            Comment.findById(comId, (err, docCom) => {
                if (err)
                    console.log(err);
                else
                    res.render('comments/edit', { campground: docCamp, comment: docCom });
            })
        }
    })
});

router.put('/:comid/', middleware.loggedIn, middleware.checkCommentAuth, (req, res) => {
    const campId = req.params.id;
    const comId = req.params.comid;
    const newCom = req.body.comment;
    Campground.findById(campId, (err, docCamp) => {
        if (err)
            console.log(err);
        else {
            Comment.findByIdAndUpdate(comId, newCom, (err, docCom) => {
                if (err)
                    console.log(err);
                else {
                    req.flash('success', 'Comment edited');
                    res.redirect('/campgrounds/' + docCamp._id);
                }
            })
        }
    });
})

router.delete('/:comid/', middleware.loggedIn, middleware.checkCommentAuth, (req, res) => {
    const comId = req.params.comid;
    const campId = req.params.id;
    Comment.deleteOne({ _id: comId }, (err) => {
        if (err)
            console.log(err);
        else {
            req.flash('success', 'Comment deleted!');
            res.redirect('/campgrounds/' + campId);
        }
    });
})

module.exports = router;