// Third party file 
const app = require('./app');
const DataBaseConnection = require('./config/database');
const cloudinary = require('cloudinary');

//port initialize 
const PORT = process.env.PORT || 5000;

//mode initialize
const NODE_ENV = process.env.NODE_ENV;


//database connection
DataBaseConnection();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// listen port for server
app.listen(PORT,()=>{
    console.log(`Server Running Port: ${PORT} on ${NODE_ENV} mode.`);
});