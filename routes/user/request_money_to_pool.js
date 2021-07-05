const express = require('express') ;
const router = express.Router() ;

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi) ;
const mongoose = require('mongoose') ;

const { Pool } = require('../../models/pool');
const {User} = require('../../models/user') ;

const auth = require('../../middleware/user_auth') ;

const moneyRequestSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId , required : true} ,
    need : { type: String , required : true},
    votes : {type : Number , required : true}
}) ;

const MoneyRequest = new mongoose.model('MoneyRequest' ,moneyRequestSchema) ;

router.post('/',auth,async(req,res)=>{
    const {error} = validateRequest(req.body) ;
    if(error) return res.status(400).send(error.message) ;

    let user = await User.findById(req.user._id) ;    

    if(user.pools_joined.indexOf(req.body.poolId) == -1)
    {
        return res.status(400).send('User is not a member of given poolId') ;
    }

    let pool = await Pool.findById(req.body.poolId) ; 
    if(!pool) return res.status(400).send('Pool is not present in DB') ;

    if(!pool.isPoolRoundRunning) return res.status(400).send('Pool round is not yet started , u cant money request to pool') ;

    for(i in pool.moneyRequests)
    {
        let mr = pool.moneyRequests[i] ;
        
        
        if(String(mr.userId) === String(user._id))
        {
            return res.status(400).send('You have already a pending request in money pool , u cant make another one till that request is satisfied');
        }
    }

    let moneyRequest = new MoneyRequest({
        userId : user._id,
        need : req.body.need,
        votes : 1
    }) ;

    pool.moneyRequests.push(moneyRequest) ;

    try 
    {
        pool =await pool.save() ;
        return res.send(pool) ;
    }
    catch(ex)
    {
        return res.status(400).send(ex.message) ;
    }
    


}) ;

function validateRequest(req)
{
    const schema = Joi.object({
        poolId :Joi.objectId().required(),
        need : Joi.string().required().min(3).max(255)

    }) ;

    return schema.validate(req) ;
}
module.exports = router ;