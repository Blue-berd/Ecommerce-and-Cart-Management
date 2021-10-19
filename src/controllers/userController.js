const mongoose = require("mongoose")
const {userModel} = require("../models")
const {validator, jwt} = require('../utils')
const {systemConfig} = require('../configs')
const bcrypt = require("bcrypt")
const { aws } = require('../aws');
const { json } = require("body-parser")


const createUser = async function(req, res){
    try{
        let requestBody = req.body.data;
        requestBody = JSON.parse(requestBody);
        let files = req.files

        if(!validator.isValidRequestBody(requestBody)){
            res.status(400).send({status:false, msg:"Please provide valid body"})
            return
        }
        
        let {fname, lname,phone, email, password, address} = requestBody;
        
        if(!validator.isValid(fname)){
            res.status(400).send({status:false, msg:"Please provide first Name"})
            return
        }

        if(!validator.isValid(lname)){
            res.status(400).send({status:false, msg:"Please provide last Name"})
            return
        }
        //phone
        if(!validator.isValid(phone)){
            res.status(400).send({status:false, msg:"Please provide phone number"})
            return
        }

        if(!validator.validateMobile(phone)){
            res.status(400).send({status:false, msg:"Please provide valid phone Number"})
            return
        }

        // email

        if(!validator.isValid(email)){
            res.status(400).send({status:false, msg:"Please provide email"})
            return
        }

        if(!validator.validateEmail(email)){
            res.status(400).send({status:false, msg:"Please provide valid email"})
            return
        }

        //address

        if(!validator.isValid(address)){
            res.status(400).send({status:false, msg:"Please provide address"})
            return
        }

        if(!validator.isValid(address.shipping.city)){
            res.status(400).send({status:false, msg:"Please provide city"})
            return
        }

        if(!validator.isValid(address.shipping.street)){
            res.status(400).send({status:false, msg:"Please provide street"})
            return
        }

        if(!validator.isValid(address.shipping.pincode)){
            res.status(400).send({status:false, msg:"Please provide pincode"})
            return
        }

        if(!validator.isValid(address.billing.city)){
            res.status(400).send({status:false, msg:"Please provide billing city"})
            return
        }

        if(!validator.isValid(address.billing.street)){
            res.status(400).send({status:false, msg:"Please provide billing street"})
            return
        }

        if(!validator.isValid(address.billing.pincode)){
            res.status(400).send({status:false, msg:"Please provide billing pincode"})
            return
        }

        if(!validator.validatePincode(address.shipping.pincode)){
            res.status(400).send({status:false, msg:"Please provide valid shipping pincode"})
            return
        }

        if(!validator.validatePincode(address.billing.pincode)){
            res.status(400).send({status:false, msg:"Please provide valid billing pincode"})
            return
        }

        // password

        if(!validator.isValid(password)){
            res.status(400).send({status:false, msg:"Please provide password"})
            return
        }

        if(!validator.isValidPassword(password)){
            res.status(400).send({status:false, msg:"Please provide valid password"})
            return
        }

        //profileImage

        var fileData = files[0]


        if(!validator.isValid(fileData)){
            res.status(400).send({status:false, msg:"Please provide valid image"})
            return
        }

        let profileImage = await aws.uploadFile(fileData)

        //encrypt password

        let saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        password = hash
        // create user
        let requiredUser = {fname,lname, email, phone, address, profileImage, password}
        let user = await userModel.create(requiredUser)

        res.status(201).send({status:true,msg:"Success" ,data:user})

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const loginUser = async function(req, res){
    try{
        let requestBody = req.body
        const {email, password} = requestBody

        if(!validator.isValid(email)){
            res.status(400).send({status:false, msg:'Please provide email'})
            return
        }

        if(!validator.isValid(password)){
            res.status(400).send({status:false, msg:'Please provide password'})
            return
        }

        let user = await userModel.findOne({email:email})

        if(!user){
            return res.status(404).send({status:false, msg:'email does not exist'})
        }

        let hashedPassword = user.password

        let passwordMatch = await bcrypt.compare(password, hashedPassword)

        if(!passwordMatch){
            return res.status(404).send({status:false, msg:'email or password dont match'})
        }

        let token = await jwt.createToken({ userId: user._id })
        res.header('bearer-token', token);
        res.status(200).send({status:true, msg:'user login succesful', data:token})

    }catch(error){
        res.status(500).send({status:false,msg:error.message})
    }

}


const getUser = async function(req, res){
    try{
        let userId = req.params.userId

        if(!validator.isValidObjectId(userId)){
            return res.status(404).send({status:false, msg:'user not found'})
        }

        let user = await userModel.findById(userId)

        if(!user){
            return res.status(404).send({status:false, msg:'user not registered'})
        }

        return res.status(200).send({status:true, msg:'User profile details', data:user})

    }catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}


const updateUser = async function(req, res){
    try{
        let userId = req.params.userId
        // const userIdFromToken = req.userId
        let files = req.files
        const requestBody = req.body

        if(!validator.isValidObjectId(userId)){
            return res.status(404).send({status:false, msg:'user not found'})
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({status:false, msg:'user not registered'})
        }


        // if(!validator.isValidObjectId(userIdFromToken)) {
        //     res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
        //     return
        // }

       
        // if(!validator.isValidRequestBody(requestBody) || !validator.) {
        //     res.status(200).send({status: true, message: 'No paramateres passed. user unmodified', data: user})
        //     return
        // }

        // Extract params
        let {lname, fname, phone, email, password, address} = requestBody;

        let updatedUserData = {}

        if(validator.isValid(lname)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['lname'] = lname
        }

        if(validator.isValid(fname)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['fname'] = fname
        }

        if(validator.isValid(phone)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['phone'] = phone
        }
        if(validator.isValid(email)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['email'] = email
        }
        // password

        if(validator.isValid(password)) {

            if(!validator.isValidPassword(password)) {
                return res.status(400).send({status:false, msg:'Password is not valid'})
            }

            let saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
    
            password = hash

            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['password'] = password
        }





        //address
        if(validator.isValid(address)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['address'] = address
        }

        // image

        

        if(validator.isValid(files)){
            const fileData = files[0]
            var profileImage = await aws.uploadFile(fileData)
        }

        if(validator.isValid(profileImage)) {
            if(!Object.prototype.hasOwnProperty.call(updatedUserData, '$set')) updatedUserData['$set'] = {}

            updatedUserData['$set']['profileImage'] = profileImage
        }
        
  

    

        const upadateduser = await userModel.findOneAndUpdate({_id: userId}, updatedUserData, {new: true})

        res.status(200).send({status: true, message: 'Blog updated successfully', data: upadateduser});
        

    }catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}

module.exports={
    createUser,
    loginUser,
    getUser,
    updateUser
}