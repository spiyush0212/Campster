// ===================
// DEPENDENCIES
// ===================

const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');

// ===================
// ROUTES
// ===================

router.get('/', (req, res) => {
    Campground.find({}, (err, doc) => {
        if (err)
            console.log(`Error in retreving data from DB = \n ${err}`);
        else
            res.render('campgrounds/index', { campgrounds: doc });
    });
});

router.get('/new', middleware.loggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', middleware.loggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.desc;

    const newCampground = {
        name: name,
        image: image,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };

    Campground.create(newCampground, (err, doc) => {
        if (err)
            console.log(`Error in saving form data to DB = \n ${err}`);
        else {
            req.flash("success", 'Campground created!')
            res.redirect('/campgrounds');
        }
    });
});

router.get('/:id', (req, res) => {
    const campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function (err, doc) {
        if (err) {
            req.flash('error', 'Error: Campground Not Found');
            console.log('Campground not found');
            console.log(err);

            res.redirect('/campgrounds');
        }
        else {
            res.render('campgrounds/show', { campground: doc });
        }
    });
});

router.get('/:id/edit', middleware.loggedIn, middleware.checkCampAuth, (req, res) => {
    const campId = req.params.id;
    Campground.findById(campId, (err, doc) => {
        if (err)
            console.log(err);
        else
            res.render('campgrounds/edit', { campground: doc });
    });
});

router.put('/:id', middleware.loggedIn, middleware.checkCampAuth, (req, res) => {
    const campId = req.params.id;
    const newCampground = req.body.campground;
    Campground.findByIdAndUpdate(campId, newCampground, (err, doc) => {
        if (err)
            return console.log(err);
        else {
            req.flash('success', 'Campground edited!')
            res.redirect('/campgrounds/' + doc._id);
        }
    });
});

router.delete('/:id', middleware.loggedIn, middleware.checkCampAuth, (req, res) => {
    const campId = req.params.id;
    Campground.deleteOne({ _id: campId }, (err) => {
        if (err)
            console.log(err);
        else {
            req.flash('success', 'Campground deleted!')
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;