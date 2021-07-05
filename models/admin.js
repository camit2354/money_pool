const Joi = require('joi');
const mongoose = require('mongoose') ;

const config = require('config');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema(
    {
        name : {type : String ,required : true , minlength : 3 },
        email : { type : String , required : true , unique : true , minlength : 5},        
        password : { type : String , required : true },
        poolId : {type : mongoose.Schema.Types.ObjectId }
    }
) ;

adminSchema.methods.generateAuthToken = function()
{
    const token = jwt.sign({_id : this._id , name : this.name , email : this.email , poolId : this.poolId} , config.get('jwtPrivateKey')) ;
    return token ;
}

const Admin = new mongoose.model('Admin' ,adminSchema) ;

function validateAdmin(admin)
{
    const schema = Joi.object ({
        name : Joi.string().min(3).max(255).required() ,
        email : Joi.string().min(5).max(255).required().email() ,
        password : Joi.string().min(3).max(255).required() 

    }) ;

    return schema.validate(admin) ;

}

module.exports.Admin = Admin ;
module.exports.validate = validateAdmin ;