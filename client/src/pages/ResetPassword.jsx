import React, { useContext, useState } from 'react'
import './Login.css'
import LoginNavbar from '../components/LoginNavbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

function ResetPassword() {
    const { backendURL } = useContext(AppContext)
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0)
    const [isOtpSubmitted, setisOtpSubmitted] = useState(false)
    const inputrefs = React.useRef([])

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
            inputrefs.current[index + 1].focus()
        }
    }
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputrefs.current[index - 1].focus();
        }
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(backendURL + '/api/auth/resetOTP', { email })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onOTPSubmit = async (e) => {
        e.preventDefault()
        const otpArray = inputrefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        setisOtpSubmitted(true)
    }

    const onNewPassword = async (e)=>{
         e.preventDefault()
         try {
            const {data} = await axios.post(backendURL + '/api/auth/resetPassword', {email, otp, newPassword})
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
         } catch (error) {
            toast.error(error.message)
         }
    }
    return (
        <>

            <div className='LoginContainer flex items-center justify-center min-h-screen px-5 sm:px-0'>
                <LoginNavbar />
                {!isEmailSent && <form onSubmit={onSubmitEmail} className='bg-slate-50 px-4 sm:px-0 flex flex-col items-center p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-slate-950 text-3xl font-bold text-center mb-3'>Reset Password</h1>
                    <p className='text-slate-950 text-sm font-medium text-center mb-3'>Enter your registered email address</p>

                    <input value={email} onChange={e => setEmail(e.target.value)} className='shadow-xl shadow-slate-600 bg-slate-900 outline-none text-white rounded-full w-65 sm:w-90 px-4 py-2.5 mt-3 sm:mt-5 mb-3 sm:mb-5' placeholder='Email' type="email" required />

                    <button className='text-white font-bold bg-slate-900 hover:text-white transition-all hover:bg-slate-950 border-1 rounded-full w-65 sm:w-85 px-4 py-2.5 border-slate-500 cursor-pointer  hover:scale-103'>Send OTP</button>
                </form>}


                {!isOtpSubmitted && isEmailSent && <form onSubmit={onOTPSubmit} className='bg-slate-50 px-4 sm:px-0 flex flex-col items-center p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-slate-950 text-2xl font-bold text-center mb-3'>Reset Password OTP</h1>
                    <p className='text-slate-950 text-sm font-medium text-center mb-3'>Enter 6-digit code sent to your email id to reset password.</p>
                    <div className='flex justify-center gap-1 mb-8'>
                        {Array(6).fill(0).map((_, index) => (
                            <input type="text" maxLength='1' key={index} required className='w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white text-center text-xl rounded-xl' ref={e => inputrefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
                        ))}
                    </div>
                    <button className='text-white font-bold bg-slate-900 hover:text-white transition-all hover:bg-slate-950 border-1 rounded-full w-65 sm:w-85 px-4 py-2.5 border-slate-500 cursor-pointer  hover:scale-103'>Verify OTP</button>
                </form>}

                {isOtpSubmitted && isEmailSent && <form onSubmit={onNewPassword} className='bg-slate-50 px-4 sm:px-0 flex flex-col items-center p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-slate-950 text-3xl font-bold text-center mb-3'>New Password</h1>
                    <p className='text-slate-950 text-sm font-medium text-center mb-3'>Enter the new password below</p>

                    <input value={newPassword} onChange={e => setNewPassword(e.target.value)} className='shadow-xl shadow-slate-600 bg-slate-900 outline-none text-white rounded-full w-65 sm:w-90 px-4 py-2.5 mt-2 sm:mt-1 mb-3 sm:mb-5' placeholder='Password' type="password" required />

                    <button className='text-white font-bold bg-slate-900 hover:text-white transition-all hover:bg-slate-950 border-1 rounded-full w-65 sm:w-85 px-4 py-2.5 border-slate-500 cursor-pointer  hover:scale-103'>Save Password</button>
                </form>}


            </div>
        </>
    )
}

export default ResetPassword