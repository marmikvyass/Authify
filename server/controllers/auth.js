//controller function we will create will be --- signin, login, logout, verifications, reset password 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import transporter from '../config/nodemailer.js';




export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'user missing details' })
    }

    try {
        //check user already exist 
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User already exist' })
        }

        //generates hashed passwords
        const hasedPassword = await bcrypt.hash(password, 10)
        //registrates new user data 
        const registerUser = new User({ name, email, password: hasedPassword })
        await registerUser.save();
        //creates token id for new registration created that token is valid for 7 days
        const token = jwt.sign({ id: registerUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        //sending welcome email to user
        const sendEmail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Authify',
            text: `Welcome to Authify, Your account has been created with this email id: ${email}`
        }

        await transporter.sendMail(sendEmail)

        return res.json({ success: true, message: 'registration successfully, you can check your mail' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body
    //request for email and passwords for login 
    if (!email || !password) {
        return res.json({
            success: false, message: 'Email and Password are required'
        })
    }
    try {
        const loginuser = await User.findOne({ email })
        if (!loginuser) {
            return res.json({ success: false, message: 'Invalid user data, user not found.' })
        }
        const isMatch = await bcrypt.compare(password, loginuser.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        const token = jwt.sign({ id: loginuser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message:'Login Successful' })


    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            // maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: 'You have been logged out' })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//send verification otp to users email

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId)

        if (user.isVerified) {
            return res.json({
                success: false,
                message: 'Account already verified'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyExpired = Date.now() + 5 * 60 * 1000

        await user.save()

        const sendMail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to Authify',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }

        await transporter.sendMail(sendMail)

        res.json({
            success: true,
            message: 'OTP send to your email'
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

//verification of email using otp
export const verifyEmail = async (req, res) => {

    const userId = req.userId
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: 'Details missing'
        })
    }
    else {
        try {
            const user = await User.findById(userId)
            if (!user) {
                return res.json({
                    success: false,
                    message: 'User not found'
                })
            }

            if (user.verifyOtp == '' || user.verifyOtp !== otp) {
                return res.json({
                    success: false,
                    message: 'OTP invalid'
                })
            }
            if (user.verifyExpired < Date.now()) {
                return res.json({
                    success: false,
                    message: 'OTP expired'
                })
            }
            else {
                user.isVerified = true
                user.verifyEmail = ''
                user.verifyExpired = 0
            }

            await user.save();

            return res.json({
                success: true,
                message: 'Email verified successfully'
            })

        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            })
        }
    }
}


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: 'you are already logged in'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.json({
            success: false,
            message: 'Email is required'
        })
    }
    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: 'user not found'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOTP = otp;
        user.resetOTPExpire = Date.now() + 5 * 60 * 1000

        await user.save()

        const sendMail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password OTP',
            text: `Your OTP for reseting your password is ${otp}. Use this OTP for reseting your password`
        }

        await transporter.sendMail(sendMail)

        res.json({
            success: true,
            message: 'OTP send to your email for reseting password'
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: 'Invalid credentials'
        })
    }

    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }
        if (user.resetOTP === '' || user.resetOTP != otp) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            })
        }


        if (user.resetOTPExpire < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            })
        }

        if(user.password === newPassword){
            return res.json({
                message:'Enter New Password'
            })
        }
        
        const hasedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hasedPassword
        user.resetOTP = ''
        user.resetOTPExpire = 0

        await user.save()

        return res.json({
            success: true,
            message: 'Password has been reset successfully'
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

