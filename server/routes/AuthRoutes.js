const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../middlewares/authentication');
const { verifyToken, signup, verifyOtp, login } = require('../controllers/AuthControllers');
const upload = require('../config/cloudinary');
const router = express.Router();


// signup 
router.route('/signup').post(signup);

//otp verify 
router.route('/verify-otp').post(verifyOtp);

//login

router.route('/login').post(login);




router.route('/google').get(passport.authenticate('google',{scope:["profile", "email"]}));

router.route('/google/callback').get(passport.authenticate('google',{failureRedirect:'/'}),
async(req,res)=>{
    let user = req.user;
    const ACCESS_TOKEN = await user.getJwtAccessToken();
   
    res.redirect(`http://localhost:3000/auth/callback?accessToken=${ACCESS_TOKEN}`);
});

router.route('/verify-token').post(isAuthenticated,verifyToken);



module.exports = router;