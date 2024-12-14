const jwt = require('jsonwebtoken');
const User = require('../models/AuthModel');



exports.isAuthenticated = async(req,res,next)=>{

    let accessToken;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        accessToken = req.headers.authorization.split(" ")[1];
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY);
      const user = await User.findById(decoded.id);
      if(!user)return res.status(401).json('Unauthorized');
      req.user = user;
      next();
}