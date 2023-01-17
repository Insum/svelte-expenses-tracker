const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {port, mongoURI} = require('./config')

mongoose.set('strictQuery', false)
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
})
.then(() => console.log('MongoDB is connected'))
.catch((err) => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Express running on port ' + port))