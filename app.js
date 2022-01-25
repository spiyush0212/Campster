// ===================
// DEPENDENCIES
// ===================

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    path = require('path'),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    session = require('express-session'),
    User = require('./models/user'),
    ejs = require('ejs'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

const indexRoutes = require('./routes/index'),
    commentRoutes = require('./routes/comment'),
    campgroundRoutes = require('./routes/campground');

// ===================
// DATA BASE
// ===================


const databaseurl = process.env.DATABASEURL;
mongoose.connect(databaseurl, () =>
    console.log('Server connected to database')
);
// seedDB();

// ===================
// APP CONFIG
// ===================

app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(flash());

// ===================
// AUTH CONFIG
// ===================

app.use(session({
    secret: 'password',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================
// MIDDLEWARE
// ===================

app.use((req, res, next) => {
    res.locals.curUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// ===================
// ROUTES
// ===================

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// ===================
// PORT
// ===================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});