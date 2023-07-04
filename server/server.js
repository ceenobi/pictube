import express, { json } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { connectToDB } from './config/mongo.js'
import pinRoutes from './routes/pin.js'
import authUserRoutes from './routes/authUser.js'
import commentRoutes from './routes/comment.js'

const app = express()
config()
app.use(cors())
app.use(json())
app.disable('x-powered-by')

// app.use('/api/v1/pins', pinRoutes)
app.use('/api/v1/auth', authUserRoutes)
app.use('/api/v1/pin', pinRoutes)
app.use('/api/v1/pin/comment', commentRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})
const PORT = process.env.PORT || 5000
connectToDB()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server connected to http://localhost:${PORT}`)
      })
    } catch (error) {
      console.log('Cannot connect to the server')
    }
  })
  .catch((error) => {
    console.log('Invalid database connection...!')
  })

app.get('/', (req, res) => {
  res.send('app is running')
})
