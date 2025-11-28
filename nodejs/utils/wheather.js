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

  module.exports={
    weather
  }
  
 