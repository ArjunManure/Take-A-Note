const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {

    console.log(profile);
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0].value
    }

    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);

      }
      else {
        user = await User.create(newUser);
        return done(null, user);
      }
    } catch (error) {
      console.log(error);
    }

  }
));


router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback' ,
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: "/dashboard"
  }),
);

//Route for something goes wrong
router.get("/login-failure", (req, res) => {
  res.send("Something went wrong----");
})

//Session destroying
router.get("/logout",(req,res)=>{
  req.session.destroy(error =>{
    if(error){
      console.log(error);
      res.send("Error While Logging out");

    }else{
      res.redirect("/")
    }

  })
})



//persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

//retreive user data from session.
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;