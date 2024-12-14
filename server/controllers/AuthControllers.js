const { sendEmailOtp } = require("../mailConfig/email");
const catchAsyncErrorHandler = require("../middlewares/catchAsyncErrorHandler");
const User = require("../models/AuthModel");
const ErrorHandler = require("../utils/errorHandler");


exports.signup = catchAsyncErrorHandler(async(req,res,next)=>{
    const { userName, email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return next(new ErrorHandler("Email already registered",400));
        }
        user = new User({userName,email,password});
        const otp = await user.generateOTP(6);

        await user.save();
        await sendEmailOtp(email,otp)


        res.status(201).json("OTP send your email, please verify!");
    } catch (error) {
        return next(new ErrorHandler(error,400));
    }
  
});

exports.verifyOtp = catchAsyncErrorHandler(async(req,res,next)=>{
    const { email, otp } = req.body;
    try {
        let user = await User.findOne({email, emailOtpExpires: { $gt: Date.now() }});
        if(!user){
            return next(new ErrorHandler("Invalid email or expired OTP",400));
        }
        const isMatchOTP = await user.compareOTP(otp);
        if(!isMatchOTP){
            return next(new ErrorHandler("Wrong OTP", 400));
        }
        user.isVerified = true;
        user.source = 'email';
        user.emailOtp = undefined;
        user.emailOtpExpires = undefined;
        await user.save();
        const jwtToken = await user.getJwtAccessToken();

        res.status(200).json(jwtToken)
    } catch (error) {
        return next(new ErrorHandler(error,400));
    }
})



exports.login = catchAsyncErrorHandler(async(req,res,next)=>{
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user)return next(new ErrorHandler("User not found",404));
        const passMatch = await user.comparePWD(password);
        if(!passMatch)return next(new ErrorHandler('Password not match',404));
        const jwtToken = await user.getJwtAccessToken();
    
        res.status(200).json(jwtToken)

    } catch (error) {
        return next(new ErrorHandler(error,400))
    }
})




exports.verifyToken = (req,res) =>{
    res.json({user: req.user});
 }