const express= require('express');
const dbconnect=require('./config/db');

//connect database
dbconnect();

const app=express();
const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
res.send('API running');
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

