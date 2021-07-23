const express = require('express') ;
const router = express.Router() ;

const Joi = require('joi') ;
Joi.objectId = require('joi-objectid')(Joi) ;

const {Pool} = require('../../models/pool') ;
const {User} = require('../../models/user') ;

const auth = require('../../middleware/user_auth') ;

router.post('',auth,async(req,res)=>{

    const {error} = validateRequest(req.body) ;
    if(error) return res.status(400).send(error.message) ;

    try{
            let user = await User.findById(req.user._id) ;    

            if(user.pools_joined.indexOf(req.body.poolId) == -1)
            {
                return res.status(400).send('User is not a member of given poolId') ;
            }

            let pool = await Pool.findById(req.body.poolId) ; 
            if(!pool) return res.status(400).send('Pool is not present in DB') ;

            if(!pool.isPoolRoundRunning) return res.status(400).send('Pool round is not yet started , u cant money request to pool') ;

           
        res.send({user , pool}) ;

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
        moneyRequestUserId : Joi.objectId().required()

    }) ;

    return schema.validate(req) ;
}

module.exports = router ;