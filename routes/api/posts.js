const express =require('express');
const router=express.Router();

//@route GET /api/posts
//@desc  test routes
//@access  public

router.get('/', (req,res)=>{
    res.send('posts routes');
})
module.exports=router;