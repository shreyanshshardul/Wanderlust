const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../model/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
 
main().then(()=>{
    console.log("connection successful  to DB!!!")
})
.catch((err) =>{
    console.log(err);
})

const initDB = async() =>{
    await listing.deleteMany({});
     const initcurrent =   initData.data.map((obj) => ({...obj , owner : "6887337e0188507c18bc2b23"}))
    await listing.insertMany(initcurrent);
    console.log("Successful!!")
}

initDB();