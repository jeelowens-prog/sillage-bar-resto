const express=require('express')
const app=express()
const port=3000 //80

app.get('/',(req,res)=>{
    res.send('hello world comment ca va')
})

app.get('/about',(req,res)=>{
    res.send({
        nom:"john",
        age:30,
        prenom:'jeeko'
    })
})
app.get('/contact',(req,res)=>{
    res.send('contact me')
})


app.listen(port,()=>{
    console.log(`exemple app listening on port ${port}`)
})