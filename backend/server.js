const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bcrypt = require('bcrypt')

require('dotenv').config()
app.use(express.json())

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('mongodb connected!')
    }catch(error){
        console.error('Mongodb connection error: ', error)

        process.exit(1)
    }
}

connectDB()

const posts = [
    {
        username: 'Cherrie',
        title: 'Post 1'
    },
    {
        username: 'Charisse',
        title: 'Post 2'
    }
]

app.get('/posts', (req, res) => {
    res.json(posts)
})

app.get('/login', (req, res) => {

})

app.post('/add-user', (req, res) => {

})

app.listen(3000)