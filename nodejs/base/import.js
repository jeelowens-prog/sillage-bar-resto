const f=require("./export.js")

console.log(f.multiply(3,10))
console.log(f.divide(3,4))

//sans f
const {multiply}=require('./export.js')
console.log(multiply(3,20))

const{chain, divide}=require('mathjs')

console.log(chain(3)
    .add(4)
    .multiply(2)
    .divide(4)
    .done() ) // (3+3)*2/4=3.5

    