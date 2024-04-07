const express= require('express');
const dbconnect=require('./config/db');

const app=express();
app.use(express.json({ extended: false }));

//connect database
dbconnect();


const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
res.send('API running');
});

// define routes
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/posts' , require('./routes/api/posts'));
app.use('/api/profile' , require('./routes/api/profile'));
app.use('/api/users' , require('./routes/api/users'));

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})  

