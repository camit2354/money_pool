const mongoose = require('mongoose') ;
const config = require('config') ;
const Joi = require('joi') ;
const express = require('express') ;
const app = express() ;
require('dotenv').config({ path : '/.env' }) ;

mongoose.connect(config.get('mongodb_url')) 
.then(() => console.log(`connected to mongodb : ${ config.get('mongodb_url') } successfully ............ `))
.catch(err => console.log("error in connecting to mongodb ...........")) ;

const register_user = require('./routes/user/user_register') ;

app.use(express.json()) ;  //middleware
app.use(express.urlencoded({extended : true})) ;  // parsed key value data  from url and provided to req.body 
app.use(express.static('public')) ;

app.use('/user/register' ,register_user) ;

const port = process.env.PORT || 12345 ;
app.listen(port,()=> console.log(`Listening on port ${ port } ... `) ) ;

if(!config.get('jwtPrivateKey'))
{
    console.log('FATAL ERROR : jwtPrivateKey not set') ;
    process.exit(1) ;
}