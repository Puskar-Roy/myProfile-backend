const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log(error);
})

