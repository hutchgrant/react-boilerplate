const passport = require('passport');
const keys = require('../config/keys');
const jwt = require('../middleware/jwt');
const validate = require('../middleware/validate');
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : keys.tokenSecret});
const mongoose = require('mongoose');
const crypto = require('crypto');
const rateLimit = require('../middleware/limiter');
const User = mongoose.model('User');

module.exports = app => {
    
    app.post('/auth/signup',
        rateLimit('signup'),
        validate.checkUserAndPass,
        validate.getIPAgent,
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
        rateLimit('signup'),
        res.json({
            error: {
                message: req.flash('error')
            }
        });
    });
    
    app.post('/auth/login',
        rateLimit('login'),
        validate.checkUserAndPass,
        validate.getIPAgent,
        passport.authenticate('local.signin', {
            failureRedirect: '/auth/login_error'
        }), jwt.generateToken, (req, res) => {
            req.session.signInAttempts = 0;
            res.status(200).json({
                username: req.user.username,
                token: req.token,
                admin: req.user.admin,
                error: {}
            });
        }
    );

    app.get('/auth/login_error', 
        (req, res) => {
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
                username: user.username,
                admin: user.admin
            });
        } catch(err){
            res.status(500);
        } 
    });

    app.get('/auth/gentoken/:token', jwt.socialGenerateToken, (req, res,next) => {
        res.status(200).json({
            username: req.user.username,
            admin: req.user.admin,
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
        validate.getIPAgent, 
        passport.authenticate('google'),
        (req, res) => {
            req.session.genTokenHash = crypto.randomBytes(64).toString('hex');
            res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
        }
    );

    app.get(
        '/auth/facebook',        
        passport.authenticate('facebook', { 
            scope: ['email'] 
        }));
  
    app.get('/auth/facebook/callback', 
        validate.getIPAgent,
        passport.authenticate('facebook', { 
            failureRedirect: '/login' 
        }),
    (req, res) =>{
        req.session.genTokenHash = crypto.randomBytes(64).toString('hex');        
        res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
    });
    
    app.get('/auth/twitter',
    passport.authenticate('twitter'));
  
  app.get(
        '/auth/twitter/callback',
        validate.getIPAgent,
        passport.authenticate('twitter', { 
            failureRedirect: '/login' 
        }),
    (req, res) => {
        req.session.genTokenHash = crypto.randomBytes(64).toString('hex');        
        res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
    });
};
