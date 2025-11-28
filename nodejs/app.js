const express=require('express')
const {engine}=require('express-handlebars')
const path=require('path')
const { title } = require('process')
  
const app=express()
const port=3000 //80


app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render('home',{
        title:'home',
        message:'welcome to my app'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'about',
        message:'welcome to my app',
        nom:'jeeko the best',
        age:30,
        profession:'Etudiant',
        hobby:['foot','music','game']

    })
})







app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not found, error 404!</h1>')
})

app.use((eer,req,res,nex)=>{
    console.error(err.stack);
    res.status(500).send('Erreur , regarder le terminal')
});

app.listen(port,()=>{
    console.log(`exemple app listening on port ${port}`)
})