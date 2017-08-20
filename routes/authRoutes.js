const passport = require('passport');
const keys = require('../config/keys');
const jwt = require('../middleware/jwt');
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : keys.tokenSecret});
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');

module.exports = app => {
    app.post('/auth/signup',
        passport.authenticate('local.signup', {
            failureRedirect: '/auth/signup_error'
        }), jwt.generateToken, (req, res) => {
            res.status(200).json({
                username: req.user.username,
                token: req.token
            });
        }
    );

    app.get('/auth/signup_error', (req, res) => {
        res.json({
            error: {
                message: req.flash('error')
            }
        });
    });
    
    app.post('/auth/login',
        passport.authenticate('local.signin', {
            failureRedirect: '/auth/login_error'
        }), jwt.generateToken, (req, res) => {
            req.session.signInAttempts = 0;
            res.status(200).json({
                username: req.user.username,
                token: req.token,
                error: {}
            });
        }
    );

    app.get('/auth/login_error', (req, res) => {
        req.session.signInAttempts += 1;
        res.json({
            error: {
                message: req.flash('error'),
                attempts: req.session.signInAttempts
            }
        });
    });

    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/current_user', authenticate, async (req, res, next) => {
        try {
            const user = await User.findOne({_id: req.user.id });
            res.status(200).json({
                username:user.username
            });
        } catch(err){
            res.status(500);
        } 
    });

    app.get('/auth/gentoken/:token', jwt.socialGenerateToken, (req, res,next) => {
        res.status(200).json({
            username: req.user.username,
            token: req.token
        });
    });

    app.get(
        '/auth/google',
        passport.authenticate('google', {
          scope: ['profile', 'email']
        })
      );
    
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req, res) => {
            req.session.genTokenHash = crypto.randomBytes(64).toString('hex');
            res.redirect(`/dashboard?auth=${req.session.genTokenHash}`);
        }
    );

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) =>{
        req.session.genTokenHash = crypto.randomBytes(64).toString('hex');        
        res.redirect(`/dashboard?auth=${req.session.genTokenHash}`);
    });
    
    app.get('/auth/twitter',
    passport.authenticate('twitter'));
  
  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.genTokenHash = crypto.randomBytes(64).toString('hex');        
        res.redirect(`/dashboard?auth=${req.session.genTokenHash}`);
    });
};
