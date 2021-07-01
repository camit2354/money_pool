const Joi = require('joi');
const mongoose = require('mongoose') ;

const poolAdminSchema = new mongoose.Schema(
    {
        name : {type : String ,required : true , minlength : 3 },
        email : { type : String , required : true , unique : true , minlength : 5},        
        password : { type : String , required : true },
        poolId : {type : mongoose.Types.ObjectId , required : true}
    }
) ;

const poolAdmin = new mongoose.model('poolAdmin' ,poolAdminSchema) ;

function validatePoolAdmin(poolAdmin)
{
    const schema = Joi.object ({
        name : Joi.string().min(3).max(255).required() ,
        email : Joi.string().min(5).max(255).required().email() ,
        password : Joi.string().min(3).max(255).required() 

    }) ;

    return schema.validate(poolAdmin) ;

}

module.exports.poolAdmin = poolAdmin ;
module.exports.validate = validatePoolAdmin ;