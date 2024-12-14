const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const crypto = require("node:crypto");



const authSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dkwfwczii/image/upload/v1728697505/uploads/placeholder_dvnx1x.jpg",
    },
    isVerified: {
      type: String,
      default: false,
    },
    source: {
      type: String,
      default: "email",
    },
    emailOtp: String,
    emailOtpExpires: Date,
  },
  {timestamps: true}
);


// Ensure Virtual fields are included in JSON Response
authSchema.set("toJSON", { virtuals: true });
authSchema.set("toObject", { virtuals: true });

//password hash
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//compare password
authSchema.methods.comparePWD = async function (enteredPwd) {
  return await bcrypt.compare(enteredPwd, this.password);
};

// Generate OTP
authSchema.methods.generateOTP = async function (length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
    const salt = await bcrypt.genSalt(10);
    this.emailOtp = await bcrypt.hash(otp, salt);
    this.emailOtpExpires = Date.now() + 120 * 1000;
  }
  return otp;
};

// Compare OTP
authSchema.methods.compareOTP = function (otp) {
  return bcrypt.compare(otp, this.emailOtp);
};

// access token generate for 7 days only
authSchema.methods.getJwtAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE, // 7 days;
  });
};

const User = mongoose.model("User", authSchema);
module.exports = User;
