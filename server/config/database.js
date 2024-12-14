const mongoose = require('mongoose');

const DataBaseConnection = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('Database connection success.')
    }).catch((error)=>{
        console.log(`Database connection Error: ${error.message}`);
    })
}

module.exports = DataBaseConnection;