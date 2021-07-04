const { string } = require('joi');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose') ;


const poolSchema = new mongoose.Schema({
    name : {type : String , required : true , unique : true , minlength : 2},
    adminId : {type : mongoose.Schema.Types.ObjectId ,required: true },
    poolBalance : {type : Number , required : true },
    users : {type :Array },
    moneyRequests : {type : Array},
    satisfiedUsers : {type : Array},
    unSatisfiedUsers : {type : Array},
    joinRequests : {type : Array}

}) ;

const Pool = new mongoose.model('Pool', poolSchema) ;

function validatePool(pool)
{
    const schema = Joi.object({
        name : Joi.string().min(3).max(255).required(),
        adminId : Joi.objectId().required()
    }) ;

    return schema.validate(pool) ;
} 

module.exports.Pool = Pool ;
module.exports.validate = validatePool ;