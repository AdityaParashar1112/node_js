const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();
const app =express();
const connection  = require('./config/dbConnection')
const messagedata = require('./model/messageSchema');
const cookieParser = require('cookie-parser');
const isauthenticate = require('./Middleware/authenticate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


connection;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs')
app.use(cookieParser());



app.get('/register',(req,res)=>{
    res.render('register');
})


app.post('/register',async(req,res)=>{

    const {name,email,password} = req.body
    
    const useravailable = await messagedata.findOne({email});
    if(!useravailable){
        const hashPassword = await bcrypt.hash(password,10);
        const user = await messagedata.create({
            name,
            email,
            password:hashPassword
         })
        
         const token = jwt.sign({
            userid:user._id,
            username:user.name,
            useremail:user.email   
        },process.env.SECRET_KEY);
       
         
       res.cookie("tokken",token,{
         httpOnly:true,
        expires:new Date(Date.now() + 60*1000)
        })
        res.redirect('/loginpage');

    }else{
       res.redirect('/login')
    }
})

app.get('/login',(req,res)=>{
   res.render("login")
})

app.post('/login',async(req,res)=>{
    
       const {email,password} = req.body;
         
         const user = await messagedata.findOne({email});
         if(user){
              if(bcrypt.compare(password,user.password)){
                const token = jwt.sign({
                    userid:user._id,
                    username:user.name,
                    useremail:user.email   
                },process.env.SECRET_KEY);
               
                 
               res.cookie("tokken",token,{
                 httpOnly:true,
                expires:new Date(Date.now() + 60*1000)
                })
                res.redirect('/loginpage');
              }else{
                res.render('login',{email:email,message:"password is incorrect"})
              }
            
         }else{
            res.redirect('/register');
         }
        
        
})


app.get('/loginpage',isauthenticate,(req,res)=>{
  console.log(req.user);
  res.render("logout.ejs",{name:req.user.name})
})


   app.post('/logout',(req,res)=>{
       
       res.clearCookie('tokken');
       res.redirect('/loginpage');
       
   })


app.listen(5000,()=>{
    console.log('server is started');
})