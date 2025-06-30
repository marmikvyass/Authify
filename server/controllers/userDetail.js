import User from '../models/user.js';

export const getUserData = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await User.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success:true,
            userData: {
                name: user.name,
                isVerified: user.isVerified,
                email:user.email,
                password:user.password
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}