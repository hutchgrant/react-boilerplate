const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const keys = require('../config/keys');
const User = mongoose.model('User');
const recaptcha = require('./recaptcha');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use('local.signup',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, username, password, done) => {
        // validate fields
        req.checkBody('username', 'Invalid username').notEmpty().isLength({min:4, max: 50});
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();        
        req.checkBody({'password': {
            notEmpty: true,
            matches: {
              options: [req.body.confirm_password, 'i']
            },
            isLength: {
                options: [{ min: 8, max: 50 }],
                errorMessage: 'Password Must be between 8 and 50 characters'
              },
            errorMessage: 'Passwords must match' 
        }});   
        let errors = req.validationErrors();
        if (errors){
            var messages = [];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages))
        }
        try { 
            // validate against database
            let errors = [];
            let user = await User.findOne({username: username});
            if (user) {
                errors.push({param: 'username', msg:'Username already taken, choose a different username'});
            }
            user = await User.findOne({email: req.body.email});            
            if(user){
                errors.push({param: 'email', msg:'Email already in use'});
            }
            if (errors.length > 0){
                var messages = [];
                errors.forEach(function(error){
                    messages.push(error.msg);
                });
                return done(null, false, req.flash('error', messages))
            }

            recaptcha.validateRecaptcha(req.body.captcha, req.connection.remoteAddress).then(async () => {
                // add new user
                const admin = await User.findOne({admin: true})
                let newUser = new User({ 
                    username: username,
                    email: req.body.email,
                    admin: !admin
                });
                newUser.password = newUser.encryptPassword(password);
                newUser = await newUser.save();
                return done(null, newUser);
            }).catch((e) => {
                return done(null, false, req.flash('error', [e.error]))
            });
        } catch(err) {
            return done(err);
        }
    }
  )
);


passport.use('local.signin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },async (req, username, password, done) => {
        req.checkBody('username', 'Invalid username').notEmpty().isLength({min:4, max: 50});
        req.checkBody('password', 'Invalid password').notEmpty().isLength({min:8, max:50});
        var errors = req.validationErrors();
        if (errors){
            var messages = [];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages))
        }
        try {
            const user = await User.findOne({username: username });
            if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('error', ['Login failed. Check your username/password']));
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientId,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try{
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }
            const admin = await User.findOne({admin: true});

            const user = await new User({ 
                googleId: profile.id, 
                username: profile.name.givenName,
                givenName: profile.name.givenName,
                familyName: profile.name.familyName,
                email: profile.emails[0].value,
                admin: !admin
            }).save();
            done(null, user);
        }catch(e){
            return done(err);
        }
    })
);

passport.use(new FacebookStrategy({
    clientID: keys.facebookClientId,
    clientSecret: keys.facebookClientSecret,
    callbackURL: `${keys.redirectDomain}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']    
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const admin = await User.findOne({admin: true});
        const user = await new User({ 
            facebookId: profile.id, 
            username: profile.displayName,
            email: profile.emails[0].value,
            admin: !admin
        }).save(); 

        done(null, user);  
    }catch(e){
        return done(err);
    }
  }
));

passport.use(new TwitterStrategy({
    consumerKey: keys.twitterConsumerId,
    consumerSecret: keys.twitterConsumerSecret,
    callbackURL: `${keys.redirectDomain}/auth/twitter/callback`,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
},
  async (token, tokenSecret, profile, done) => {
    try{
        const existingUser = await User.findOne({ twitterId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const admin = await User.findOne({admin: true});

        const user = await new User({ 
            twitterId: profile.id, 
            username: profile.displayName,
            email: profile.emails[0].value,
            admin: !admin
        }).save(); 

        done(null, user);   
    }catch(e){
        return done(err);
    }
  }
));