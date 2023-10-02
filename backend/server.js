const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { serialize } = require('mongodb')
const app = express()


require('dotenv').config()
app.use(express.json())
app.use(cors())

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.URI, {
            dbName: 'Link-Sharing-App',
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

const userSchema = mongoose.Schema({
    email: String, 
    password: String
})

const User = mongoose.model("Users", userSchema)

app.post('/login', async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) 
        return res.status(400).send('Account does not exist.');
        
    if(await bcrypt.compare(req.body.password, user.password)){
        res.send('User logged in successfully')
    }else{
        res.send('Sorry, your password was incorrect.\nPlease double check your password.')
    }

})

app.post('/add-user', async(req, res) => {
    console.log('helloo', req.body);
    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = new User({ email: req.body.email, password: hashedPassword})

        try{
            await user.save()
        }catch(e){
            res.status(500).send(e)
        }

    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

app.listen(process.env.PORT || 3001)