import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import mongoose from 'mongoose'
import testRoute from './routes/test.js'
const app = express()
configDotenv()

app.use(cors())
app.use(express.json())
app.use('/api', testRoute)

const PORT = process.env.PORT || 3000

const uri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

try {
await mongoose.connect(uri, clientOptions);
await mongoose.connection.db.admin().command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
await mongoose.disconnect();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})