import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/schema.prisma' // ou onde estiver seu prisma

const router = express.Router()

// 👇 SUA ROTA DE REGISTER (já tem)
router.post('/register', async (req, res) => {
  // seu código aqui
})


// 👇 COLOCA ESSE CÓDIGO AQUI
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    console.log("LOGIN BODY:", req.body)

    if (!email || !senha) {
      return res.status(400).json({
        message: 'Preencha todos os campos'
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    console.log("USER FOUND:", user)

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    const isMatch = await bcrypt.compare(senha, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Senha incorreta'
      })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "segredo_super_secreto",
      { expiresIn: '3652d' }
    )

    return res.status(200).json({
      token,
      usuario: {
        id: user.id,
        nome: user.name,
        email: user.email,
        tipo: user.tipo
      }
    })

  } catch (err) {
    console.log("ERRO LOGIN:", err)
    return res.status(500).json({
      message: 'Erro no servidor, tente novamente'
    })
  }
})

export default router