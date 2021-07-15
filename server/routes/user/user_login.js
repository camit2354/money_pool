const express = require('express') ;
const router = express.Router() ;

const Joi = require('joi');
const bcrypt = require('bcrypt') ;
const { User } = require('../../models/user');

router.post('/',async(req,res)=>{
    const {error} = validateSignInRequest(req.body) ;
    if(error) return res.status(400).send('Invalid emailID or password') ;

    const user = await User.findOne({email : req.body.email}) ;
    if(!user) return res.status(400).send('Invalid emailID ');

    
    const validPassword = await bcrypt.compare(req.body.password ,user.password ) ;
    if(!validPassword)
    {
        return res.status(400).send('Wrong Password') ;
    }

    try
    {
        const token = user.generateAuthToken() ;
        return res.header('x-auth-token',token).send('Signed In') ;
    }
    catch(ex)
    {
        return res.status(400).send(ex.message) ;
    }
   
    
}) ;

function validateSignInRequest(user)
{
    const schema = Joi.object ({
        email : Joi.string().min(5).max(255).required().email() ,
        password : Joi.string().min(3).max(255).required() 

    }) ;

    return schema.validate(user) ;
}

module.exports = router ;