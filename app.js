const express = require('express') ;
const app = express() ;

const config = require('config') ;
const Joi = require('joi') ;

const mongoose = require('mongoose') ;

mongoose.connect(config.get('mongodb_url')) 
.then(() => console.log(`connected to mongodb : ${ config.get('mongodb_url') } successfully ............ `))
.catch(err => console.log("error in connecting to mongodb ...........")) ;

//user routers
const register_user = require('./routes/user/user_register') ;
const add_money_to_pool = require('./routes/user/add_money_to_pool') ;
const add_money_to_wallet = require('./routes/user/add_money_to_wallet');
const vote_for_pool_request = require('./routes/user/vote_for_pool_requests') ;
const remove_money_from_wallet = require('./routes/user/remove_money_from_wallet');
const request_money_to_pool = require('./routes/user/request_money_to_pool') ;
const join_pool = require('./routes/user/join_pool') ;
const user_login = require('./routes/user/user_login') ;

//admin routers
const accept_user_join_request = require('./routes/admin/accept_user_join_request');
const allocate_money_to_winner = require('./routes/admin/allocate_money_to_winner');
const create_pool = require('./routes/admin/create_pool') ;
const register_admin = require('./routes/admin/admin_register') ;
const admin_login = require('./routes/admin/admin_login') ;
const initiate_pool = require('./routes/admin/initiate_pool') ;
const initiate_pool_next_round = require('./routes/admin/initiate_pool_next_round') ;

app.use(express.json()) ;  //middleware
app.use(express.urlencoded({extended : true})) ;  // parsed key value data  from url and provided to req.body 
app.use(express.static('public')) ;

app.use('/user/login',user_login) ;
app.use('/user/register' ,register_user) ;
app.use('/user/add_money_to_pool',add_money_to_pool);
app.use('/user/add_money_to_wallet',add_money_to_wallet);
app.use('/user/vote_for_pool_request',vote_for_pool_request);
app.use('/user/remove_money_from_wallet',remove_money_from_wallet);
app.use('/user/request_money_to_pool',request_money_to_pool);
app.use('/user/join_pool',join_pool);

app.use('/admin/accept_user_join_request',accept_user_join_request);
app.use('/admin/allocate_money_to_winner',allocate_money_to_winner);
app.use('/admin/create_pool',create_pool);
app.use('/admin/register',register_admin);
app.use('/admin/login',admin_login) ;
app.use('/admin/initiate_pool',initiate_pool) ;
app.use('/admin/initiate_pool_next_round' , initiate_pool_next_round) ;

const port = process.env.PORT || 12345 ;
app.listen(port,()=> console.log(`Listening on port ${ port } ... `) ) ;

if(!config.get('jwtPrivateKey'))
{
    console.log('FATAL ERROR : jwtPrivateKey not set') ;
    process.exit(1) ;
}