const express = require('express') ;
const router = express.Router() ;

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi) ;
const mongoose = require('mongoose') ;

const { User } = require('../../models/user') ;
const {Pool} = require('../../models/pool') ;
const auth = require('../../middleware/user_auth') ;

router.post('/',auth , async(req,res)=>{
    const {error} = validateRequest(req.body) ;
    if(error) return res.status(400).send(error.message);

    let user = await User.findById(req.user._id) ;
    if(!user) return res.status(400).send('UserID not present in database') ;

    let pool = await Pool.findById(req.body._id) ;
    if(!pool) return res.status(400).send('PoolID not present in database') ;

    if(user.pools_joined.indexOf(req.body._id) == -1)
    {
        return res.status(400).send('user is not joined to requested pool') ;
    }

    if(!pool.isPoolRoundRunning)
    {
        return res.status(400).send('Pool is not active/running , u cant add money , please contact admin') ;
    }

    if(pool.roundMoneyNonAdders.indexOf(user._id) == -1)
    {
        return res.status(400).send('you have already added money to pool') ;
    }

    if(user.wallet_balance < pool.poolStdAmtToAdd)
    {
        return res.status(400).send('You have not enough money to add in pool');
    }

    try
    {
        pool.poolBalance = pool.poolBalance + pool.poolStdAmtToAdd ;
        user.wallet_balance = user.wallet_balance - pool.poolStdAmtToAdd ;
        pool.roundMoneyAdders.push(user._id);
        let idx = pool.roundMoneyNonAdders.indexOf(user._id) ;
        pool.roundMoneyNonAdders.splice(idx , 1) ;

        pool = await pool.save() ;
        user = await user.save() ;
        return res.send(pool,user) ;

    }
    catch(ex)
    {
        return res.status(400).send(ex.message) ;
    }
    

    // try 
    // {
    //     pool = await pool.save() ;
    //     user = await user.save() ;

    //     return res.status(400).send({pool , user}) ;
    // }
    // catch(ex)
    // {
    //     return res.status(400).send(ex.message) ;
    // }

    
    

}) ;

function validateRequest(req)
{
    const schema = Joi.object({
        _id :Joi.objectId().required()

    }) ;

    return schema.validate(req) ;
}

module.exports = router ;