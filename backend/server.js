import express from 'express'
import cors from 'cors'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}))
app.use('/', publicRoutes)
app.use('/', auth, privateRoutes)



app.listen(3000, () => console.log("Servidor ok"))