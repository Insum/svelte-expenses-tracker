const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { port, mongoURI } = require('./config')
const transactionsRoutes = require('./routes/transactions')
const path = require('path')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

mongoose.set('strictQuery', false)
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
})
.then(() => console.log('MongoDB is connected'))
.catch((err) => console.log(err))

app.use('/api/transactions', transactionsRoutes)

app.listen(port, () => console.log('Express running on port ' + port))