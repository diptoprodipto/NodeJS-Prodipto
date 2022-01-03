var express = require('express');

// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 10000,
//   max: 2,
//   message: "no!"
// });

var router = express.Router();
var axios = require("axios").default;
const bodyParser = require("body-parser")
const fs = require('fs')
const path = require('path');
let alert = require('alert'); 

router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())


/* GET home page. */
router.get('/', function(req, res){
  res.render('index')
})

router.get('/all/:country/:city/:date', function(req, res, next) {

  const country = req.params.country
  const city = req.params.city
  const date = req.params.date


  let temp_c_1 = temp_c_2 = temp_c_3 = temp_c_4 = temp_c_4 = temp_f_1 = temp_f_2 = temp_f_3 = temp_f_4 = []

  let max_temp_c_1 = max_temp_c_2 = max_temp_c_3 = max_temp_c_4 = min_temp_c_1 = min_temp_c_2 = min_temp_c_3 = min_temp_c_4 = max_temp_f_1 = max_temp_f_2 = max_temp_f_3 = max_temp_f_4 = min_temp_f_1 = min_temp_f_2 = min_temp_f_3 = min_temp_f_4 = ''

  let locationData = fs.readFileSync(path.resolve(__dirname, './data.json'));

  const handleApiData = (weatherData) =>{

    if(city.toLowerCase() === weatherData.location.name.toLowerCase()){
      let name = weatherData.location.name
      let country = weatherData.location.country
      let maxWind = weatherData.forecast.forecastday[0].day.maxwind_kph
      let humidity = weatherData.forecast.forecastday[0].day.avghumidity
      let date = weatherData.forecast.forecastday[0].date
      

      for(let i=0;i<weatherData.forecast.forecastday[0].hour.length;i++){
        // console.log(weatherData.forecast.forecastday[0].hour[i].temp_c)
        if(i>=0 && i<6){
          temp_c_1 = [...temp_c_1, weatherData.forecast.forecastday[0].hour[i].temp_c]
          temp_f_1 = [...temp_f_1, weatherData.forecast.forecastday[0].hour[i].temp_f]
        }
        else if(i>=6 && i<12){
          temp_c_2 = [...temp_c_2, weatherData.forecast.forecastday[0].hour[i].temp_c]
          temp_f_2 = [...temp_f_2, weatherData.forecast.forecastday[0].hour[i].temp_f]
        }
        else if(i>=12 && i<18){
          temp_c_3 = [...temp_c_3, weatherData.forecast.forecastday[0].hour[i].temp_c]
          temp_f_3 = [...temp_f_3, weatherData.forecast.forecastday[0].hour[i].temp_f]
        }
        else if(i>=18 && i<24){
          temp_c_4 = [...temp_c_4, weatherData.forecast.forecastday[0].hour[i].temp_c]
          temp_f_4 = [...temp_f_4, weatherData.forecast.forecastday[0].hour[i].temp_f]
        }
      }

      max_temp_c_1 = Math.max(...temp_c_1)
      min_temp_c_1 = Math.min(...temp_c_1)
      max_temp_f_1 = Math.max(...temp_f_1)
      min_temp_f_1 = Math.min(...temp_f_1)

      max_temp_c_2 = Math.max(...temp_c_2)
      min_temp_c_2 = Math.min(...temp_c_2)
      max_temp_f_2 = Math.max(...temp_f_2)
      min_temp_f_2 = Math.min(...temp_f_2)

      max_temp_c_3 = Math.max(...temp_c_3)
      min_temp_c_3 = Math.min(...temp_c_3)
      max_temp_f_3 = Math.max(...temp_f_3)
      min_temp_f_3 = Math.min(...temp_f_3)

      max_temp_c_4 = Math.max(...temp_c_4)
      min_temp_c_4 = Math.min(...temp_c_4)
      max_temp_f_4 = Math.max(...temp_f_4)
      min_temp_f_4 = Math.min(...temp_f_4)


      res.render('index', {
        max_temp_c_1 : max_temp_c_1,
        min_temp_c_1 : min_temp_c_1,
        max_temp_f_1 : max_temp_f_1,
        min_temp_f_1 : min_temp_f_1,
        max_temp_c_2 : max_temp_c_2,
        min_temp_c_2 : min_temp_c_2,
        max_temp_f_2 : max_temp_f_2,
        min_temp_f_2 : min_temp_f_2,
        max_temp_c_3 : max_temp_c_3,
        min_temp_c_3 : min_temp_c_3,
        max_temp_f_3 : max_temp_f_3,
        min_temp_f_3 : min_temp_f_3,
        max_temp_c_4 : max_temp_c_4,
        min_temp_c_4 : min_temp_c_4,
        max_temp_f_4 : max_temp_f_4,
        min_temp_f_4 : min_temp_f_4,
        maxWind : maxWind,
        humidity : humidity,
        name : name,
        date : date
      });

      fs.writeFileSync(path.resolve(__dirname, './data.json'), JSON.stringify(weatherData));
    }
    else{
      alert("No data found of the given location!")
      res.render('index')
    }
  
    // console.log(weatherData)
    
  }

  const fetchApiData = () =>{
    axios.get(`https://api.weatherapi.com/v1/history.json?key=7361d83e5f7f4a219e6121225212812&q=${country}&q=${city}&dt=${date}`)
        .then(result => {
          let weatherData = result.data
          fs.writeFileSync(path.resolve(__dirname, './data.json'), JSON.stringify(weatherData));
          handleApiData(weatherData)

    }).catch(err =>{
      console.log(err)
    })
  }



  if(locationData.length === 0){
      fetchApiData()
  }
  else{
    locationData = JSON.parse(locationData);

    if(locationData.location.name.toLowerCase() === city.toLowerCase() && locationData.forecast.forecastday[0].date === date){
      let weatherData = fs.readFileSync(path.resolve(__dirname, './data.json'));
      weatherData = JSON.parse(weatherData);
      handleApiData(weatherData)
    }
    else {
    
      axios.get(`https://api.weatherapi.com/v1/history.json?key=7361d83e5f7f4a219e6121225212812&q=${country}&q=${city}&dt=${date}`)
        .then(result => {
          let weatherData = result.data
          handleApiData(weatherData)
          

      })
      .catch(err =>{

      })
    }
  }
  

  
  
});

router.post('/register', (req, res) =>{
  const country = req.body.country
  const city = req.body.city
  const date = req.body.date
  axios.get(`https://api.weatherapi.com/v1/history.json?key=7361d83e5f7f4a219e6121225212812&q=${country}&q=${city}&dt=${date}&aqi=no`)
      .then(result => {
        weatherData = result.data
        console.log(weatherData)
        res.render('index');
    }
  )
  // res.send(`${country}-${city}`)
})

module.exports = router;
