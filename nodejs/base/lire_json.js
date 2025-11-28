const {readFileSync,writeFileSync}=require('fs');

const jsonToObject=JSON.parse(readFileSync('package.json','utf-8'),null,2)
//console.log(jsonToObject)
const {name,scripts,version,main,dependencies}=JSON.parse(readFileSync('package.json','utf-8'),null,2)
const data={
    name:name,
    scripts:scripts,
    version:version,
    dependencies:dependencies,
    main:main
}
const js=JSON.parse(readFileSync('data.json','utf8'))
js.nane='nodejs'
writeFileSync('data.json',JSON.stringify(js,null,2))

debugger
console.log(js)