const express =require('express');
const router=express.Router();

//@route GET /api/auth
//@desc  test routes
//@access  public

router.get('/', (req,res)=>{
    res.send('auth routes');
})
module.exports=router;