const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const dotenv = require('dotenv'); 
const router = require('./router/route.js')
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "1024mb" }));
app.use(bodyParser.urlencoded({ limit: "1024mb", extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
dotenv.config()
app.disable("x-powered-by");

app.use('/api',router);
require('./database/connectDb')


app.listen(process.env.PORT,()=>{
    console.log("server start at port " + process.env.PORT);
})