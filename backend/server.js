const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Schema } = require('mongoose')
const redis = require('redis')
const bodyParser = require('body-parser')
const { _applyPlugins } = require('mongoose')
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const app = express()
const client = redis.createClient();

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(cookieParser());
require('dotenv').config()
app.use(express.json())
app.use(cors())
client.connect()

client.on('connect', () => {
    console.log('Connected to Redis');
})

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

    console.log('user', user);
    if(!user) return res.status(400).send('Account does not exist.');

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)
    if(!verifiedPassword)
        return res.send('Sorry, your password was incorrect.\nPlease double check your password.')
    
    const { accessToken, refreshToken } = await generateAccessToken(user)
    
    client.set(refreshToken, user._id.toString(), { EX: 7 * 24 * 60 * 60, NX: true })

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false })
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false , maxAge: 10 * 60 * 1000}).status(200).json({ message: "Logged in successfully!" });

})

app.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken

    jwt.verify(refreshToken, 'refresh_secret', (err, user) => {
        if(err) return res.status(403).send('Invalid Refresh Token.');

        client.get(refreshToken, (err, userId) => {
            if (err || !userId || userId !== user._id) {
                return res.status(403).send('Refresh Token is not valid');
            }
            const newAccessToken = jwt.sign({ id: userId }, 'access_secret', { expiresIn: '10m' });
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false, maxAge: 10 * 60 * 1000})

            res.send('Token refreshed successfully.')
        })
    })
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
    const accessToken = jwt.sign({id: JSON.stringify(user._id)}, 'access_secret', { expiresIn: '10m' }); 
    const refreshToken = jwt.sign({id: JSON.stringify(user._id)}, 'refresh_secret', { expiresIn: '7d' });
    console.log('access?', accessToken)
    console.log('refresh?', refreshToken)
    return { accessToken, refreshToken }

}

app.listen(process.env.PORT || 3001)