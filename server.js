const express = require('express')
const app = express()
const mongose = require('mongoose')
const dotenv = require('dotenv')

mongose.connect(process.env.DATABASE_ACCESS, () => console.log("database connected"))

app.listen(3000, () => console.log("server is runing"))