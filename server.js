
const express = require('express');
const path = require("path");
const app = express();
require('dotenv').config()

const dbConfig = require('./config/dbConfig');

app.use(express.json());

const userRoute = require('./routes/userRoute');
app.use('/api/user', userRoute);

const adminRoute = require('./routes/adminRoute')
app.use('/api/admin', adminRoute);

const workerRoute = require('./routes/workerRoute');
app.use('/api/worker', workerRoute);

const port = process.env.PORT || 5000;


app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// if (process.env.NODE_ENV ==='production'){
//     app.use('/',express.static('client/build'));
//     app.get('*', (req,res)=>{
//         res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
//     });
// }

app.get("/", (req,res)=> res.send("hello world"));


app.listen(port, () => console.log(`Node server started at port ${port}`)); 