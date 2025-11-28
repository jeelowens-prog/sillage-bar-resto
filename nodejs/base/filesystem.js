const fs=require('fs')

//readFileSync <- lire le contenu dun fichier
//writeFileSync <- ecrire dans un fichier

const list=[]
for(let i=65;i<200;i++){
    list.push(String.fromCharCode(i)+'='+i)
}
fs.writeFileSync('text.txt',list.join('\n'));
console.log('fichier a ete cree')

const file=fs.readFileSync('text.txt','utf-8');
console.log(file)
//==========export fonction================
