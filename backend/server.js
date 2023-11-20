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
const session = require('express-session')
const cookie = require('cookie')

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(cookieParser());
require('dotenv').config()
app.use(express.json())
app.use(cors())
client.connect()

app.use(session({
    proxy: true,
    secret: 'test',
    cookie: {
      secure: true
    },
    resave: true,
    saveUninitialized: true       
  }));

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

const generateAccessToken = async(user) => {
    const accessToken = jwt.sign({id: JSON.stringify(user._id)}, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '10m' }); 
    const refreshToken = jwt.sign({id: JSON.stringify(user._id)}, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '7d' });
    console.log('access?', accessToken)
    console.log('refresh?', refreshToken)
    return { accessToken, refreshToken }

}

const jwtHandler = async(req, res, next) => {
    const accessToken = req.cookies.accessToken
    jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
        console.log('decoded?', decoded)
        if (err){
            return res.status(401).json({ valid: false, message: 'Invalid token.' });
        }

        console.log('grabbed token: ', accessToken)
        next();
    })
}


app.post('/login', async(req, res) => {    
    const user = await User.findOne({ email: req.body.email });

    console.log('user', user);
    if(!user) return res.status(401).send('Account does not exist.');
    console.log('password that user entered', await bcrypt.compare(req.body.password, user.password));

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)
    if(!verifiedPassword)
        return res.status(401).send({ message: 'Sorry, your password was incorrect.\nPlease double check your password.'})
    
    const { accessToken, refreshToken } = await generateAccessToken(user)
    
    client.set(refreshToken, user._id.toString(), { EX: 7 * 24 * 60 * 60, NX: true })
    console.log('does it go here?')
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000})
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

app.get('/validate-token', jwtHandler, (req, res) => {
    res.json({valid: true})
})
//NOTE: Not sure if this is the best way yet 
app.post('/logout', (req, res) => {
    res.cookie('accessToken', '', {expires: new Date(0), httpOnly: true, secure: false, path: '/' });
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, secure: false, path: '/'});

    res.status(200).send('Logged out successfully');
})


app.listen(process.env.PORT || 3001)