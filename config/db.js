const mongoose=require('mongoose');
const config=require('config');
const db=config.get('mongoURI');

const dbconnect= async ()=>{
    try {
        await mongoose.connect(db);
        console.log("mongodb connected ...");
    } catch (err) {
        console.log(err.message);
        //exit process
        process.exit(1);
    }
   
}

module.exports=dbconnect;