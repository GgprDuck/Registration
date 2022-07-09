const mongoose = require("mongoose");
const express = require('express');
const app = express();
const router = require('./router.js');

app.use("/v1/user", router);

module.exports = async function databaseConnect(){
    mongoose 
    .connect("mongodb://localhost:27017/HW3", { useNewUrlParser: true })
    .then(() => {
        app.listen(5000, function () {
            console.log("Server is running");
        })
    })
    .catch(()=>{
        console.log(Error);
    })
}
