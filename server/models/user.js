import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    verifyOtp: {type:String, default:''},
    verifyExpired: {type:Number, default: 0},
    isVerified: {type:Boolean, default: false},
    resetOTP: {type:String, default: ''},
    resetOTPExpire: {type:Number, default: 0},
})

const user =mongoose.model.user || mongoose.model('user', userSchema)

export default user;