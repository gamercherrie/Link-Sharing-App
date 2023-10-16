const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Schema } = require('mongoose')
const redis = require('redis')

const app = express()
const client = redis.createClient()



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

const userTokenSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        require: true
    },
    token: {
        type: String, 
        required: true
    },
    createdAt:{
        type: Date, 
        default: Date.now,
        expires: 30 * 84600
    }
})

const User = mongoose.model("Users", userSchema)
const UserToken = mongoose.model("UserToken", userTokenSchema)

app.post('/login', async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log('user', user);
    if(!user) 
        return res.status(400).send('Account does not exist.');

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)
    if(!verifiedPassword)
        return res.send('Sorry, your password was incorrect.\nPlease double check your password.')

    const {accessToken, refreshToken} = generateAccessToken(user)
    res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in sucessfully",
        });
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

const generateAccessToken = async(user) => {
    const accessToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_SECRET_TOKEN, { expiresIn: '15m'}) 
    const refreshToken = jwt.sign(JSON.stringify(user), process.env.REFRESH_SECRET_TOKEN, { expiresIn: '30d'})

    const userToken = await UserToken.findOne({ userId: user._id})
    if(userToken) await userToken.remove()

    await new UserToken({ userId: user._id, token:refreshToken }).save()
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict'})
    .header('Authorization', 'Bearer ' + accessToken)
    .send(user);

}

app.listen(process.env.PORT || 3001)