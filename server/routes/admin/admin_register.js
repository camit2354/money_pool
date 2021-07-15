const express = require('express') ;
const router = express.Router() ;

const _ = require('lodash');
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose') ;

const { Admin , validate } = require('../../models/admin') ;


router.post('/',async(req,res)=>{
    const {error} = validate(req.body) ;
    if(error) return res.status(400).send(error.message) ;

    let admin = await Admin.findOne({email : req.body.email }) ;
    if(admin) return res.status(400).send('admin already registered') ;

    admin = new Admin({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        poolId : null
    }) ;

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password,salt) ;

    try
    {
        admin = await admin.save() ;
        
        
    }
    catch(ex)
    {        
        return res.status(400).send(`registration failed ${ex.message}`) ;
    }

    try 
    {
        const token = admin.generateAuthToken() ;    
        return res.header('x-auth-token',token).send(_.pick(admin , ['_id', 'name' ,'email'])) ;

    }
    catch(ex)
    {
        return res.send(ex.message);
    }
    
}) ;

module.exports = router ;