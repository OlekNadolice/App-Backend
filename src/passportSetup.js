const passport = require("passport");
const env = require("dotenv").config();
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        profileImage: profile.photos[0].value,
        email: profile.emails[0].value,
      };
      try {
        let user = await User.findOne({ googleId: newUser.googleId });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
