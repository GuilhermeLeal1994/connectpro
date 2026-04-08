import jwt from 'jsonwebtoken'

const JWt_SECRET = process.env.JWt_SECRET

const auth = (req, res, next) =>{

    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }

    try{
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWt_SECRET)

        req.userId = decoded.id

    }catch(err){
        return res.status(401).json({message: 'token invalido'})
    }



    next()
}

export default auth