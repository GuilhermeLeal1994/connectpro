import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/list-user', async (req, res) =>{
    try{

        const user = await prisma.user.findMany()
        res.status(200).json({message: 'Usários listados com sucesso', user})
        
    }catch(err){
        res.status(500).json({message: 'Falha no servidor'})
    }

})

export default router