const express =require('express');
const router=express.Router();

//@route GET /api/profiles
//@desc  test routes
//@access  public

router.get('/', (req,res)=>{
    res.send('profile routes');
})
module.exports=router;