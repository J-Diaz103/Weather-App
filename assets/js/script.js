// api call below doe not give the correct data needed
// http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${ApiKey}
// api call below give the faranheit info
//http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${ApiKey}&units=imperial
//api call will give UVindex
// i can make var of the lan and lon to fill in the 
// http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid=${ApiKey}
//This will be for the 5 day forcast
//api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${ApiKey}
var ApiKey = "c511e5d07f5ce85a7063eeb997c17013";

$("#searchBtn").click(function() {
	var savedCities = [];

	function dayInfoSection() {
		$("#searchBtn").click(function() {
			var searchTerm = $("#search").val();
			fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${ApiKey}&units=imperial`)
				.then(function(data) {
					return data.json();
				})
				.then(function(data) {
					console.log(data);
					// console.log(data.name); //the name of the city
					// console.log(data.main.temp);//the current temp
					// console.log(data.main.humidity);//the humidity
					// console.log(data.wind.speed)//the wind speed
					// console.log(data.dt)// this should be the unix time stamp
					var citiesNames = data.name;
					var currentTemp = data.main.temp;
					var currentHumidity = data.main.humidity;
					var currentWind = data.wind.speed;
					var dataLat = data.coord.lat; //need this for uv index data pull
					var dataLon = data.coord.lon; // need this for uv index data pull
					var unixtime = data.dt // var needed to convert to
					var dateInf = moment.unix(unixtime).format("MM/DD/YYYY");
					$("#saved-cities").append(`
                <button type="button" class="btn btn-outline-dark col-12 cityClass" data-cities="${citiesNames}">${citiesNames}</button>
                `);
					$("#weather-info").append(`
                <div class="card col-12" >
                <div class="card-body">
                  <h1 class="card-title" data-date="${dateInf}">${citiesNames} ${dateInf}</h1>
                  <h2 class="card-subtitle mb-2 text-muted" data-temp="${currentTemp}">Temperature: ${currentTemp} °F</h2>
                  <h2 class="card-subtitle mb-2 text-muted" data-humidity="${currentHumidity}">Humidity: ${currentHumidity} %</h2>
                  <h2 class="card-subtitle mb-2 text-muted" data-humidity="${currentWind}">Wind Speed: ${currentWind} MPH</h2>
                </div>
              </div>
                `)
						//nested fetch to pull the uv index data
					fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${dataLat}&lon=${dataLon}&appid=${ApiKey}`)
						.then(function(data) {
							return data.json();
						})
						.then(function(data) {

							var uvIndex = parseFloat(data.value);
							console.log(uvIndex);
							if (uvIndex <= 2) {
								$("#weather-info").append(`
                    <h2 class="card-subtitle mb-2 text-muted">UV Index: <h2 class="card-subtitle mb-2" style="background-color: green; color: black; width: fit-content; "> ${uvIndex}</h2></h2>
                    `)
							} else if (uvIndex > 2 && uvIndex <= 5) {
								$("#weather-info").append(`
                    <h2 class="card-subtitle mb-2 text-muted">UV Index: <h2 class="card-subtitle mb-2" style="background-color: yellow; color: black; width: fit-content; "> ${uvIndex}</h2></h2>
                    `)
							} else if (uvIndex > 5 && uvIndex <= 7) {
								$("#weather-info").append(`
                    <h2 class="card-subtitle mb-2 text-muted">UV Index: <h2 class="card-subtitle mb-2" style="background-color: orange; color: black; width: fit-content; "> ${uvIndex}</h2></h2>
                    `)
							} else if (uvIndex > 7 && uvIndex <= 10) {
								$("#weather-info").append(`
                    <h2 class="card-subtitle mb-2 text-muted">UV Index: <h2 class="card-subtitle mb-2" style="background-color: red; color: black; width: fit-content; "> ${uvIndex}</h2></h2>
                    `)
							} else {
								$("#weather-info").append(`
                    <h2 class="card-subtitle mb-2 text-muted">UV Index: <h2 class="card-subtitle mb-2" style="background-color: purple; color: black; width: fit-content; "> ${uvIndex}</h2></h2>
                    `)
							}

							//this will add the city to the local storage array of cities
							savedCities.push({
								"city": citiesNames,
								"temp": currentTemp,
								"humidity": currentHumidity,
								"wind": currentWind,
								"date": dateInf,
								"uv": uvIndex
							});
							console.log(savedCities);
						});
				});
			// This should make it to were the function starts over if no name is entered
			if ($("#search").val("")) {}
			return;
		});
	};

	// will add the week info
	//     function weekInfoSection(citiesNames){
	//         fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${citiesNames}&appid=${ApiKey}`) 
	//         .then(function (data) {
	//         return data.json();
	//     })
	//   .then(function(data){
	//     console.log(data);
	//   })};

	//   weekInfoSection();
	dayInfoSection();
});