var express = require('express');
var router = express.Router();
const app_secret ='b8603c06ccc1e52ea2df37c850d26662';
const app_id = '325195180896395';
var FB = require('fb');
FB.options({version: 'v4.0'});
var fbApp = FB.extend({appId: app_id, appSecret: app_secret});
var accessToken ='';



/* GET users listing. */
router.get('/login', function(req, res, next) {
    //res.send('respond with a resource');
    
    
    
    FB.api('oauth/access_token', {
        client_id: app_id,
        client_secret: app_secret,
        grant_type: 'client_credentials',
        redirect_uri: 'http://botmela.samuraigeeks.net/fb/users',
        //code: 'code'
    }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
     
         accessToken = res.access_token;

        console.log ('Access Token : ' + accessToken);
        FB.setAccessToken(accessToken);
        var expires = res.expires ? res.expires : 0;
        console.log ("expires : " + expires);
        /*FB.api('me', { fields: ['id', 'name'], access_token: accessToken }, function (res) {
            console.log(res);
        });*/
        
        
    
    });
    
    
    
    
    /*FB.api('4', function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        console.log(res.id);
        console.log(res.name);
      });*/
 

});


router.get('/users', function(req, res, next) {

        var accessToken = 'EAACYjN2VuhIBAMKc2nd7a8VZA9H9zHGDbWz1ltJSGHnC9t88dRjrEvfDixjBjPh79ZBdA3fUWNblKSKc1HauRrCXGZCDvvQvLKoGaAgdBWHA7AMUPKjyZA4T6E6FfbrJGJ92ICKFFn4J7h3bUULP8xI8hsPsfenO5ZAohQeul9jiYzHwMGZCSWoBFPybDybNQZD';

        console.log ('Access Token : ' + accessToken);
        console.log ("fb users");
        FB.setAccessToken(accessToken);
         FB.api('me', { fields: ['id', 'name'], access_token: accessToken }, function (res) {
            console.log(res);
        });
        

});
  
  module.exports = router;
  
