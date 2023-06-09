const {check,body} = require("express-validator");
const { throwNewError, errorMsg } = require("../../../utils/errorHandlerUtils");
const { statusCode } = require("../../../utils/statusCodeUtil");
const { isEmpty, getUserFromToken } = require("../../../utils/dataUtils");
const userScheama = require("../../../models/Admin/user/userSchema")


exports.createUserRules = [
    body('username').custom(async(value,{req})=>{
        if(isEmpty(value)){
            throwNewError("Please enter valid user name",statusCode.BAD_REQUEST)
        }
        const result = await userScheama.findOne({username:value});
        if(result){
            throwNewError("User name already exists",statusCode.CONFLICT)
        }
        return true;
    }),
    body('email',errorMsg("Please enter valid email",statusCode.BAD_REQUEST)).isEmail().normalizeEmail().custom(async(value,{req})=>{
        const result = await userScheama.findOne({email:value});
        if(result){
            throwNewError("Email already exists",statusCode.CONFLICT)
        }
        return true;
    }),
    body('password',errorMsg("Password length should me more than 5",statusCode.BAD_REQUEST)).isLength({min:5}).trim(),
    body('confirmedpassword').trim().custom((value,{req})=>{
        if(value !== req.body.password)
        {
            throwNewError("Password and confirmed password are not matching",statusCode.BAD_REQUEST)
        }
        return true;
    })
]

exports.userSignInRule = [
    body('username').custom(async(value,{req})=>{
        if(isEmpty(value)){
            throwNewError("Please enter valid user name",statusCode.BAD_REQUEST)
        }
        const result = await userScheama.findOne({username:value});
        if(!result){
            throwNewError("User name doesn't exists",statusCode.NOT_FOUND)
        }
        return true;
    }),
    body('password').custom(async(value,{req})=>{
        if(isEmpty(value))
        {
            throwNewError("Password shouldn't be empty",statusCode.BAD_REQUEST);
        }
        return true;
    })
]

exports.updateUserInfoRule = [
    body('username').custom(async(value,{req})=>{
        if(isEmpty(value)){
            throwNewError("Please enter valid user name",statusCode.BAD_REQUEST)
        }
        const result = await userScheama.findOne({username:value});
        if(!result){
            throwNewError("Can't able to update username that's not present",statusCode.CONFLICT)
        }
        return true;
    }),
    body('email',errorMsg("Please enter valid email",statusCode.BAD_REQUEST)).isEmail().normalizeEmail().custom(async(value,{req})=>{
        let result = await userScheama.findOne({email:value,username:req.body.username});
        if(result)
        {
            return true;
        }
        result = await userScheama.findOne({email:value});
        if(result){
            throwNewError("Email already exists",statusCode.CONFLICT)
        }
        return true;
    }),
    body('password',errorMsg("Password length should me more than 5",statusCode.BAD_REQUEST)).isLength({min:5}).trim(),
    body('confirmedpassword').trim().custom((value,{req})=>{
        if(value !== req.body.password)
        {
            throwNewError("Password and confirmed password are not matching",statusCode.BAD_REQUEST)
        }
        return true;
    }),
    body('role').trim().custom((value,{req})=>{
        return true;
    })
]

exports.forgotPasswordRule = [
    body('email',errorMsg("Please enter valid email",statusCode.BAD_REQUEST)).isEmail().normalizeEmail().custom(async(value,{req})=>{

        const result = await userScheama.findOne({email:value});
        if(!result){
            throwNewError("Email doesn't exixts.",statusCode.NOT_FOUND)
        }
        return true;
    })
]

exports.updatePasswordRule =[
    body('password',errorMsg("Password length should me more than 5",statusCode.BAD_REQUEST)).isLength({min:5}).trim(),
    body('confirmedpassword').trim().custom((value,{req})=>{
        if(value != req.body.password)
        {
            throwNewError("Password and confirmed password are not matching",statusCode.BAD_REQUEST)
        }
        return true;
    })
]