const express =require('express');
const { check, validationResult } = require('express-validator');
const router=express.Router();

//@route POST /api/users
//@desc  test routes
//@access  public

router.post('/',
[
    check('name','Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more character').isLength({min: 6})

],
 (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }
    res.send('user routes');
})
module.exports=router;