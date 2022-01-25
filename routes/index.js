const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username
    });
    const password = req.body.password;
    User.register(newUser, password, (err, doc) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('/register');
        }
        else {
            passport.authenticate('local')(req, res, () => {
                req.flash('success', 'Account created!')
                res.redirect('/campgrounds');
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage: true
    }),
    (req, res) => {
        req.flash('success', 'Logged you in!');
        res.redirect('/campgrounds');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds');
})

module.exports = router;