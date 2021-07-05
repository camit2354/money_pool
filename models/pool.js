const { string } = require('joi');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose') ;


const poolSchema = new mongoose.Schema({
    name : {type : String , required : true , unique : true , minlength : 2},
    adminId : {type : mongoose.Schema.Types.ObjectId ,required: true },
    poolBalance : {type : Number , required : true },
    
    moneyRequests : {type : Array, required : true},
    joinRequests : {type : Array, required : true},


    satisfiedUsers : {type : Array, required : true},
    users : {type :Array , required : true},
    unSatisfiedUsers : {type : Array, required : true},

    noOfRounds : {type : Number, required : true},
    roundId     : {type : Number, required : true},
    roundMoneyAdders : {type :Array , required : true},
    roundMoneyNonAdders : {type :Array , required : true},

    poolStdAmtToAdd : {type : Number, required : true},
    poolIsJoinUsersAllowed : {type : Boolean, required : true},
    isPoolRoundRunning : {type : Boolean, required : true}
    

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