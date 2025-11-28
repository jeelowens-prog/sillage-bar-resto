
function multiply(x,y){
    return x*y
}
function divide(x,y){
    if(y==0) throw new Error('impossible de diviser par 0')
    return x/y
}
module.exports={
    multiply,divide
}