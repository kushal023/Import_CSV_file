var express=require("express")
var mongoose=require("mongoose")
var csvtojson = require("csvtojson")
var dotenv=require("dotenv")
dotenv.config()


var {DB,PORT}=require("./config");


var server=express()


mongoose.connect(DB,{useNewUrlParser: true, useUnifiedTopology: true},)
.then(() => {
    console.log("DB Connected!");
    // db = client.db();
}).catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});
var db=mongoose.connection
db.on("error",(error)=>{
    console.error(error)
})
db.once("open",()=>{
    console.log("Database connection established!")
})

var fileName = "problems.csv";
var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    // Fetching the all data from each row
    for (var i = 0; i < source.length; i++) {
         var oneRow = {
            question: source[i]["question"],
            answer: source[i]["answer"],
            level: source[i]["level"]
         };
         arrayToInsert.push(oneRow);
     }     //inserting into the table "employees"
     var collectionName = 'problems';
     var collection = db.collection(collectionName);
     collection.insertMany(arrayToInsert, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log("Import CSV into database successfully.");
         }
     });
});







server.listen(PORT, (req, res)=>{
    console.log(`http://localhost:${PORT}`)
})

