import  jwt  from 'jsonwebtoken';

export default function authUser (req,res,next) {

    const authHeader = req.headers['authorization']

    if(!authHeader)
    {
        return res.status(401).json({message:"You must be logged to access this!"})
    }
    const token = authHeader.split(' ')[1]

    if(token)
    {
        jwt.verify(token , process.env.JWT_SECRET,(err,user)=>{
            
            if(err)
            {return res.status(401).json({message:"You must be logged to access this!"})}

            next()
        })
    }
    else
    {
        return res.status(401).json({message:"You must be logged to access this"})
    }
}