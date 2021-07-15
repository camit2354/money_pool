const express = require('express') ;
const router = express.Router() ;

const _ = require('lodash');
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose') ;

const { User , validate } = require('../../models/user') ;

router.post('/',async (req,res)=>{

    
    const {error} = validate(req.body) ;
    if(error) return res.status(400).send(error.message) ;

    let user = await User.findOne({email : req.body.email}) ;
    if(user) return res.status(400).send('user already registered') ;

    user = new User({
        name : req.body.name ,
        email : req.body.email ,
        password : req.body.password,
        wallet_balance : 0,
        pools_joined : [],
        score         : 1
    });    

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt) ;

    try
    {
        user = await user.save() ;
        const token = user.generateAuthToken() ;
        return res.header('x-auth-token',token).send(_.pick(user , ['name' ,'email' ,'password','wallet_balance','pools_joined','score'])) ;
    }
    catch(ex)
    {
        console.log(ex.message) ;
        return res.status(400).send('registration failed') ;
    }
   
   
    
}) ;


module.exports = router ;