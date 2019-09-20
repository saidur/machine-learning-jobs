var express             = require('express'),
    app                 = express(),
    passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
    session             = require('express-session');

var router = express.Router();
const util = require('util');
 

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
    done(null, users[2]);
});
passport.deserializeUser(function (id, done) {
    done(null, users[2]);
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
        //app.use(session(newUser));
        users.push(newUser);
        console.log(users);
        return done(null, newUser);
    }
}));
 


 

 
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
   
    //var accessToken = req.session.token;
    
    // console.log (" content users : " + users);
   // var user = findUser(req.user.id);
    console.log (" user  details : " );
    console.log(util.inspect(req.session.passport.user, {depth: null}));
    
    var user_access_token =req.session.passport.user.token;
    var user_id = req.session.passport.user.token;

    const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
  
    const options = {
      method: 'GET',
      uri: 'https://graph.facebook.com/v2.8/${req.params.id}',
      qs: {
        access_token: user_access_token,
        fields: userFieldSet
      }
    };
    req(options)
      .then(fbRes => {
        res.json(fbRes);
      })
    
    
    
    
    /*User.findOne({facebookID: req.user.id}, (err, user) => {
        if (err) return;
        FB.setAccessToken(user.accessToken);
        FB.api('/me/accounts', (pages) => {
            let data = pages.data.map((page) => {
                return {
                    name : page.name,
                    id : page.id
                }
            });
            res.json([...data]);
        });
    });*/

    res.send("Congratulations! you've successfully logged in." +req.session.passport.user.id);
});
 
// logout request handler, passport attaches a logout() function to the req object,
// and we call this to logout the user, same as destroying the data in the session.
router.get("/logout", function(req, res) {
    req.logout();
    res.send("logout success!");
});


app.get('/facebook-search/:id', isLoggedIn, function (req, res) {

    // you need permission for most of these fields
    
    var user_access_token =req.session.passport.user.token;
    var user_id = req.session.passport.user.token;

    const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
  
    const options = {
      method: 'GET',
      uri: 'https://graph.facebook.com/v2.8/${req.params.id}',
      qs: {
        access_token: user_access_token,
        fields: userFieldSet
      }
    };
    request(options)
      .then(fbRes => {
        res.json(fbRes);
      })
  })



 module.exports = router;
  

