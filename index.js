const express = require('express')
const mongoose = require('mongoose')
const app  = express()
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/sipproj",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.emails || !profile.emails[0]) {
            // Check if necessary profile information is undefined
            return done(null, false, {
              message: "Incomplete profile information",
            });
          }
  
          // Check if user already exists in the database
          let user = await User.findOne({ googleId: profile.id });
  
          if (user) {
            console.log("Its saved now ");
            return done(null, user);
          } else {
            // If the user doesn't exist, create a new user
            user = new User({
              googleId: profile.id,
              displayName: profile.displayName || "Default Name",
              email: profile.emails[0].value || "Default Email",
              // Add other properties as needed
            });
            console.log("Its saved in the pc ");
            await user.save();
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );


app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

// Check MongoDB connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});


app.listen(4001,()=>{
    console.log("Server listening successfully on port 4001")
})
