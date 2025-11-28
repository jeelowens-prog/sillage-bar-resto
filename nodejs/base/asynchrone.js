/*const request=require('postman-request')
request('https://eudushare.onrender.com/api/stats',(error,response,body)=>{
      
    const data=JSON.parse(body)
       console.log(data)
})

*/

async function getData(){
    const url='https://eudushare.onrender.com/api/stats'
    try{
        const response=await fetch(url);
        if(!response.ok){ throw new Error('Response status: '+response.status)
        }
    const result=await response.json()
    console.log(result);
    }catch(err){
        console.error(err.message)
    }
}
//getData()


//weather api
// api:      8c897beca41336db416a27d87c0f5f16

// Pour Node.js ≥ 18, fetch est global, mais parfois il faut l'activer via un flag
// OU utiliser une version récente (≥ 18.15)

const parametre = {
    access_key: "f360ed5c46c1fb6fe2a71dd3e4a59902",
    query: "port-au-prince",
    units: "f"
  };
  
  // Vérifie que fetch existe
  /*
  if (typeof fetch === 'undefined') {
    console.error("fetch non disponible. Installe node-fetch.");
  } else {
    fetch(`https://api.weatherstack.com/current?access_key=${parametre.access_key}&query=${parametre.query}&units=${parametre.units}`)
      .then(res => res.json())
      .then(data => console.log(data.location))
      .catch(err => console.error(err)); 
  }*/
//creer une fonction wheather
const weather = (location, unit, callback) => {
    const url = `https://api.weatherstack.com/current?access_key=f360ed5c46c1fb6fe2a71dd3e4a59902&query=${encodeURIComponent(location)}&units=${unit}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // ✅ Vérifie s'il y a une erreur
        if (data.error) {
          callback(`Unable to find location. Erreur : ${data.error.info}`, undefined);
        } else {
          // ✅ Renomme 'location' pour éviter le conflit
          const { current, location: loc } = data;
          callback(
            undefined,
            `Le nom de la ville est ${loc.name}. Le pays est ${loc.country}. La région est ${loc.region}. Il fait ${current.temperature} degrés ${unit === 'f' ? 'Fahrenheit' : 'Celsius'}.`
          );
        }
      })
      .catch(err => {
        callback(`Erreur réseau ou autre : ${err.message}`, undefined);
      });
  };
  
  // Appel
  weather('Port-au-prince', 'm', (err, data) => {
    if (err) {
      console.log('Error :', err);
    } else {
      console.log('Data :', data);
    }
  });