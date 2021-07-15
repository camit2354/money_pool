const express = require('express') ;
const router = express.Router() ;

const mongoose = require('mongoose') ;

const { User , validate } = require('../../models/user') ;
const auth = require('../../middleware/user_auth') ;
router.post('/',auth ,async(req,res)=>{
    let user = await User.findOne({email : req.user.email}) ;
    if(!user) return res.status(400).send('user not exists ') ;

    if(user.wallet_balance < req.body.money)
    {
        return res.status(400).send('Insufficient Balance in wallet');
    }
    
    try
    {
        user.wallet_balance = user.wallet_balance - req.body.money ;
        user =  await user.save() ;
        return res.send(user) ;

    }
    catch(ex)
    {
        return res.status(400).send(ex.message) ;
    }
    
}) ;

module.exports = router ;