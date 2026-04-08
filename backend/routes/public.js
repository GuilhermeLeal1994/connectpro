import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET

//Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

    const userDb = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashPassword,
      },
    })
    res.status(201).json(userDb)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
  }
  })

    //Login
    router.post('/login', async (req, res) => {
        try{
            const userInfo = req.body

            //Busca usario no Bd
            const user = await prisma.user.findUnique({
                where: {email: userInfo.email}
            })
            //Verifica se o usario existe no Bd
            if(!user){
                return res.status(404).json({message: 'Usário não encontrado'})
            }

            //Compara a senha do Bd com a que o usario digitou
            const isMathc = await bcrypt.compare(userInfo.password, user.password)
            if(!isMathc){
                return res.status(400).json({message: 'Senha incorreta'})
            }

            //Gera o Token JWT
            const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '3652d'})


            res.status(200).json(token)
        } catch (err){
            res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
        }
         
    })



export default router