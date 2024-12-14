const passport = require('passport');
const User = require('../models/AuthModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cloudinary = require('cloudinary');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (access, refresh, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                const googleImage = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'https://res.cloudinary.com/dkwfwczii/image/upload/v1728697505/uploads/placeholder_dvnx1x.jpg';
                let cloudinaryImage = null;
                if (googleImage) {
                    const uploadResult = await cloudinary.v2.uploader.upload(googleImage, {
                        public_id: `user_${profile.id}`,
                        folder: 'uploads',
                        width: 150,
                        height: 150,
                        crop: 'fill',
                    });
                    cloudinaryImage = uploadResult.secure_url;
                }
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    userName: profile.displayName,
                    image: cloudinaryImage || googleImage,
                    isVerified: profile._json.email_verified,
                    source: profile.provider
                });
            }

            return done(null, user);
        } catch (error) {
            console.log(error);
        }
    }
));
// const result = await cloudinary.v2.uploader.upload(images[i],{
//     folder: "products"
// });

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


module.exports = passport;