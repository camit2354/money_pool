const Joi = require('joi');
const mongoose = require('mongoose') ;

const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema(
    {
        name : {type : String ,required : true , minlength : 3 },
        email : { type : String , required : true , unique : true , minlength : 5},        
        password : { type : String , required : true , minlength : 3},
        wallet_balance : {type : Number , required : true},
        pools_joined :{type : Array },
        score : {type : Number , required : true}
    }
) ;

userSchema.methods.generateAuthToken = function()
{
    const token = jwt.sign({_id : this._id , name :this.name , email : this.email} , config.get('jwtPrivateKey')) ;
    return token ;
}

const User = new mongoose.model('User' ,userSchema) ;

function validateUser(user)
{
    const schema = Joi.object ({
        name : Joi.string().min(3).max(255).required() ,
        email : Joi.string().min(5).max(255).required().email() ,
        password : Joi.string().min(3).max(255).required() 

    }) ;

    return schema.validate(user) ;

}

module.exports.User = User ;
module.exports.validate = validateUser ;