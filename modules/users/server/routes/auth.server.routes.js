'use strict';

/**
 * Module dependencies.
 */
var usersPolicy = require('../policies/users.server.policy'),
    userAuthentication = require('../controllers/users.authentication.server.controller'),
    userPassword = require('../controllers/users.password.server.controller'),
    passport = require('passport');

module.exports = function(app) {

  // Confirm users email
  app.route('/api/auth/confirm-email/:token')
    .get(userAuthentication.validateEmailToken)
    .post(userAuthentication.confirmEmail);

  // Resend email confirmation
  app.route('/api/auth/resend-confirmation')
    .post(userAuthentication.resendConfirmation);

  // Setting up the users password api
  app.route('/api/auth/forgot').post(userPassword.forgot);
  app.route('/api/auth/reset/:token')
    .get(userPassword.validateResetToken)
    .post(userPassword.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(userAuthentication.signup);
  app.route('/api/auth/signup/validate').post(userAuthentication.signupValidation);
  app.route('/api/auth/signin').post(userAuthentication.signin);
  app.route('/api/auth/signout').get(userAuthentication.signout);

  // Validate username

  // Setting the facebook oauth routes
  // See permissions:
  // https://developers.facebook.com/docs/facebook-login/permissions
  app.route('/api/auth/facebook').all(usersPolicy.isAllowed)
    .get(passport.authenticate('facebook', {
      scope: [
        'email',
        'user_friends'
      ]
    }))
    .put(userAuthentication.updateFacebookOAuthToken);
  app.route('/api/auth/facebook/callback').all(usersPolicy.isAllowed)
    .get(userAuthentication.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  app.route('/api/auth/twitter').all(usersPolicy.isAllowed)
    .get(passport.authenticate('twitter'));
  app.route('/api/auth/twitter/callback').all(usersPolicy.isAllowed)
    .get(userAuthentication.oauthCallback('twitter'));

  // Setting the github oauth routes
  app.route('/api/auth/github').all(usersPolicy.isAllowed)
    .get(passport.authenticate('github'));
  app.route('/api/auth/github/callback').all(usersPolicy.isAllowed)
    .get(userAuthentication.oauthCallback('github'));

};
