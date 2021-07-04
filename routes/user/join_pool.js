const express = require('express') ;
const router = express.Router() ;

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi) ;

const {User} = require('../../models/user') ;
const {Pool} = require('../../models/pool');
const auth = require('../../middleware/user_auth') ;

router.post('/',auth ,async(req ,res)=>{
    const {error} = validateRequest(req.body) ;
    if(error) return res.status(400).send(error.message);

    let user = await User.findById(req.user._id) ;
    if(!user) return res.status(400).send('UserID not present in database') ;

    let pool = await Pool.findById(req.body._id) ;
    if(!pool) return res.status(400).send('PoolID not present in database') ;

    try 
    {
        pool.joinRequests.push(user._id) ;
        pool = await pool.save() ;
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
        _id :Joi.objectId().required()

    }) ;

    return schema.validate(req) ;
}
module.exports = router ;