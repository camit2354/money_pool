const express = require('express');
const router = express.Router() ;

const mongoose = require('mongoose') ;

const auth = require('../../middleware/admin_auth') ;
const {Pool} = require('../../models/pool');

router.post('',auth ,async(req,res)=>{
    if(!req.admin.poolId) return res.status(400).send('Admin do not have any pool') ;
    
    let pool = await Pool.findById(req.admin.poolId) ;
    if(!pool) return res.status(400).send('Pool is not present') ;

    pool.roundId = (pool.roundId + 1 )% pool.noOfRounds ;

    pool.roundMoneyAdders = [] ;
    for(i in pool.users)
    {
        pool.roundMoneyNonAdders.push( pool.users[i] );
    }

    pool.isPoolRoundRunning = true ;

    try {
        pool = await pool.save() ;
        return res.send(pool) ;
    }
    catch(ex)
    {
        res.status(400).send(ex.message) ;
    }

}) ;
module.exports = router ;