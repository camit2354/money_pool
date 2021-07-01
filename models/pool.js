const { string } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose') ;

const poolSchema = new mongoose.Schema({
    name : {type : String , required : true , unique : true , minlength : 2},
    adminId : {type : String ,required: true },
    poolBalance : {type : Number , required : true},
    users : [userSchema],
    moneyRequests : [moneyRequestSchema],
    assignedUsers : [String],
    unAssignedUsers : [String],


})