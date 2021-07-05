const express = require('express') ;
const router = express.Router() ;

const mongoose = require('mongoose');
const {Pool , validate} = require('../../models/pool') ;
const {Admin} = require('../../models/admin') ;
const auth = require('../../middleware/admin_auth') ;

router.post('/',auth,async(req,res)=>{
    let pool_util = {name : req.body.name , amt : req.body.poolStdAmt , adminId : req.admin._id} ;
    const {error} = validate(pool_util) ;
    if(error) return res.status(400).send(error.message) ;

    let admin = await Admin.findById(pool_util.adminId) ;
    if(!admin) return res.status(400).send('Invalid adminId') ;

    if(admin.poolId) return res.status(400).send('Admin already assigned a pool ,One admin cant handle two pools ') ;
    
    let pool = new Pool({
        name : pool_util.name,
        adminId : pool_util.adminId,
        poolBalance : 0,

        users : [],
        moneyRequests : [],
        satisfiedUsers : [],
        unSatisfiedUsers : [],        
        joinRequests : [],

        noOfRounds : 0 ,
        roundId    : -1 ,
        roundMoneyAdders : [],
        roundMoneyNonAdders : [],

        poolStdAmtToAdd : pool_util.amt,
        poolIsJoinUsersAllowed : true,
        isPoolRoundRunning : false
    }) ;

    try 
    {
        pool = await pool.save() ;
        admin.poolId = pool._id ;

        admin = await admin.save() ;

        return res.send({pool , admin}) ;
    }
    catch(ex)
    {
        return res.status(400).send(ex.message) ;
    }
   
}) ;

module.exports = router ;