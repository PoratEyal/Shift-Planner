const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config();
const routesUrls = require('./routes/routes')
const cors = require('cors')

mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to Database'))
  // .then(() => {
  //   console.log("Database connected");
  // })
  // .catch((error) => {
  //   console.log("Error connecting to the database:", error);
  // });

app.use(express.json())
// app.use(cors())
app.use('/app', routesUrls)
app.listen(3001, () => console.log("server is runing"))