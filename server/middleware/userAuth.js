import jwt from "jsonwebtoken"

const userAuth = (req, res, next)=>{
    const token = req.cookies?.token;

    if(!token){
        return res.json({
            success:false,
            message:'Not authorized login again'
        })
    }
    else{
        try {
           const tokenDecoded =  jwt.verify(token, process.env.JWT_SECRET)

           if(tokenDecoded.id){
                req.userId = tokenDecoded.id
           }
           else{
                return res.json({
                    success:false,
                    message:'Not authorized login again'
                })
           }

           next()

        } 
        catch (error){
            res.json({
                success:false,
                message:error.message
            })
        }
    }
}

export default userAuth
