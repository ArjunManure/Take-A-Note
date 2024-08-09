const mongoose = require("mongoose");
mongoose.set("strictQuery",false);

const connectDB = async() =>{
    try{
    const conn = await mongoose.connect("mongodb://localhost:27017/notes-website");
    console.log(`Databse connected : ${conn.connection.host}`);
    }
    catch(error){
        console.log(error);

    }
}

module.exports = connectDB;