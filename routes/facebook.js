var express             = require('express'),
    app                 = express(),
    passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
    session             = require('express-session');

var router = express.Router();
 

    /*var facebookAuth = {
        'clientID'        : '313227515533228', // facebook App ID
        'clientSecret'    : 'e5e96c56b76d4254ebc5878d57c6e8da', // facebook App Secret
        'callbackURL'     : 'http://localhost:8000/fb/facebook/callback'
    };*/

    var facebookAuth = {
        'clientID'        : '325195180896395', // facebook App ID
        'clientSecret'    : 'b8603c06ccc1e52ea2df37c850d26662', // facebook App Secret
        'callbackURL'     : 'https://botmela.samuraigeeks.net:9443/fb/auth/facebook/callback'
    };


    // hardcoded users, ideally the users should be stored in a database
    var users = [
    {"id":111, "username":"amy", "password":"amyspassword"},
    { 
        "id" : "222",
        "email" : "test@test.com", 
        "name" : "Ben", 
        "token" : "DeSag3sEgaEGaYRNKlQp05@diorw"}
    ];

    function findUser(id) {
        for(var i=0; i<users.length; i++) {
            if(id === users[i].id) {
                return users[i]
            }
        }
        return null;
    }

    // passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});
  
// passport facebook strategy
passport.use(new FacebookStrategy({
    "clientID"        : facebookAuth.clientID,
    "clientSecret"    : facebookAuth.clientSecret,
    "callbackURL"     : facebookAuth.callbackURL
},
function (token, refreshToken, profile, done) {
    var user = findUser(profile.id);
    if (user) {
        console.log(users);
        return done(null, user);
    } else {
        var newUser = {
            "id":       profile.id,
            "name":     profile.name.givenName + ' ' + profile.name.familyName,
            //"email":    (profile.emails[0].value || '').toLowerCase(),
            "token":    token
        };
        users.push(newUser);
        console.log(users);
        return done(null, newUser);
    }
}));
 
 
// initialize passposrt and and session for persistent login sessions
router.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
 
 
// route middleware to ensure user is logged in, if it's not send 401 status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
}


// home page
router.get("/", function (req, res) {
    res.send("Hello!");
});
 
// login page
router.get("/login", function (req, res) {
    res.send("<a href='/fb/auth/facebook'>login through facebook</a>");
});


// send to facebook to do the authentication
router.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
// handle the callback after facebook has authenticated the user
router.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/fb/content",
        failureRedirect : "/fb"
}));


// content page, it calls the isLoggedIn function defined above first
// if the user is logged in, then proceed to the request handler function,
// else the isLoggedIn will send 401 status instead
router.get("/content", isLoggedIn, function (req, res) {
    console.log (" users : " + users);
    res.send("Congratulations! you've successfully logged in.");
});
 
// logout request handler, passport attaches a logout() function to the req object,
// and we call this to logout the user, same as destroying the data in the session.
router.get("/logout", function(req, res) {
    req.logout();
    res.send("logout success!");
});

 module.exports = router;
  

