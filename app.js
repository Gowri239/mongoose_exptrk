const express = require('express')
var cors = require('cors')
// const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// const compression = require('compression')
// const helmet = require('helmet')
// const morgan = require('morgan')
// const fs = require('fs')
// const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

// console.log(require('crypto').randomBytes(256).toString('base64'));

const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetpassword')

// const sequelize = require('./util/database')
// const User = require('./models/users')
// const Expense = require('./models/expense')
// const Order = require('./models/orders')
// const Forgotpassword = require('./models/forgotpassword')
// const Downloadurl = require('./models/downloadurls');

const bcrypt = require('bcrypt')

const app = express()
app.use(cors())
// app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }))

// const privateKey = fs.readFileSync('server.key')
// const certificate = fs.readFileSync('server.cert')

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/password',resetPasswordRoutes)

// app.use((req,res)=>{
//    res.sendFile(path.join(__dirname ,`views/${req.url}` ))
// })

// const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})

// app.use(helmet())
// app.use(compression())
// app.use(morgan('combined',{stream: accessLogStream}))

mongoose.connect('mongodb+srv://gowrimopuru:KKkg2329@cluster0.fepeojp.mongodb.net/expenses')
.then(()=>{
    app.listen(3000 , (req,res)=>{
        console.log('running')
    })
})




 
