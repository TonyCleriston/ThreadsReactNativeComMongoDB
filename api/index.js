require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://tony:q1w2e3r4@cluster0.9x7bme0.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connected to db')
}).catch((err) => {
    console.log(err)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

const User = require('./models/user')
const Post = require('./models/post')

app.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: "Email já registrado"})
        }
        const newUser = new User({
            name,
            email,
            password
        })
        newUser.verificationToken = crypto.randomBytes(20).toString('hex')

        await newUser.save()
        sendVerificationEmail(newUser.email, newUser.verificationToken)
        res.status(200).json({message: "Usuário criado com sucesso, verifique seu email"})
    } catch (err) {
        console.log("error:", err)
        res.status(500).json({message: "Algo deu Errado"})
    }
})

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "tonysonic1227@gmail.com",
            pass: process.env.PASSWORD
        },
    })
    const mailOpitions = {
        from: 'threads.com',
        to: email,
        subject: 'Verificação de Email',
        text: `Por favor clique no link para verificar seu email: http://localhost:3000/verify/${verificationToken}`,
    }
    try {
        await transporter.sendMail(mailOpitions)
    } catch (err) {
        console.log("error sending email: ", err)
    }
}

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({verificationToken: token})
        if (!user) {
            return res.status(404).json({message: "Invalid token"})
        }
        user.verified = true
        user.verificationToken = null
        await user.save()
        res.status(200).json({message: "Email verificado com sucesso"})
    } catch (err) {
        console.log("error getting token:", err)
        res.status(500).json({message: "Verificação de Email sem exito"})
    }
})
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex')
    return secretKey
}
const secretKey = generateSecretKey()

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: "Email Invalido"})
        }
        if (user.password !== password) {
            return res.status(404).json({message: "Senha inválida"})
        }
        const token = jwt.sign({userId: user._id}, secretKey)
        res.status(200).json({token})
    } catch (err) {
        console.log("error ao realizar Login:", err)
        res.status(500).json({message: "Falha ao realizar o Login"})
    }
})

app.get("/user/:userId", (req, res) => {
    try {
      const loggedInUserId = req.params.userId;
        console.log(loggedInUserId)
        User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
            console.log(users)
          res.status(200).json(users);
        })
        .catch((error) => {
          console.log("Error: ", error);
          res.status(500).json("errror");
        });
    } catch (error) {
      res.status(500).json({ message: "error getting the users" });
    }
  });

app.post('/follow', async (req, res) => {
    const {currentUserId, selectedUserId} = req.body
    try {
        await User.findByIdAndUpdate(selectedUserId, {$push: {followers: currentUserId}})
        res.sendStatus(200)
    } catch (err) {
        console.log("error following:", err)
        res.status(500).json({message: "Falha ao seguir"})
        
    }
})

app.post('/users/unfollow', async (req, res) => {
    const {loggedInUserId, targetUserId} = req.body
    try {
        await User.findByIdAndUpdate(targetUserId, {$pull: {followers: loggedInUserId}})
        res.sendStatus(200)
    } catch (err) {
        console.log("error unfollowing:", err)
        res.status(500).json({message: "Erro ao deixar de seguir"})
    }
})

app.post('/create-post', async (req, res) => {
    try {
        const {content, userId} = req.body
        const newPostData = {
            user:userId,
        }

        if(content) {
            newPostData.content = content
        }

        const newPost = new Post(newPostData)
        await newPost.save()
        res.status(200).json({message: "Post criado com sucesso"})
    } catch (err) {
        console.log("error create-post:", err)
        res.status(500).json({message: "Erro ao criar seu Post"})
    }
})

app.put('/posts/:postId/:userId/like', async (req, res) => {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        const post = await Post.findById(postId).populate('user','name')
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $addToSet: {likes: userId}
        },
        {new: true}
        )
        if (!updatedPost) {
            return res.status(404).json({message: "Post não encontrado"})
        }
        updatedPost.user = post.user

        
    } catch (err) {
        console.log("error like-post:", err)
        res.status(500).json({message: "Erro ao curtir o Post"})
    }
})

app.put('/posts/:postId/:userId/unlike', async (req, res) => {
    const postId = req.params.postId
    const userId = req.params.userId
    try {
        const post = await Post.findById(req.params.postId)
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $pull: {likes: userId}
        },
        {new: true}
        
        )

        updatedPost.user = post.user

        if(!updatedPost) {
            return res.status(404).json({message: "Post não encontrado"})
        }
        res.json(updatedPost)
    } catch (err) {
        console.log("error like-post:", err)
        res.status(500).json({message: "Erro ao descurtir o Post"})
    }
})

app.get('/get-posts' , async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name').sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (err) {
        console.log("error get-posts:", err)
        res.status(500).json({message: "Erro ao buscar Posts"})
    }
})

app.get('profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "Pessoa não encontrada"})
        }
        return res.status(200).json({user})
    } catch (err) {
        res.status(500).json({message: "Erro ao buscar Perfil"})
    }
})
