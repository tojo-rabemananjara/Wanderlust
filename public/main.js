// Foursquare API Info
const clientId = config.fs_clientId;
const clientSecret = config.fs_clientSecret;
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = config.openWeatherKey;
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6"), $("#venue7"), $("#venue8"), $("#venue9")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const numVenuesToFetch = 30;

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=${numVenuesToFetch}&client_id=${clientId}&client_secret=${clientSecret}&v=20211101`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await(response.json());
      // console.log(jsonResponse);
      const venues = jsonResponse.response.groups[0].items.map(parameter => parameter.venue);
      // console.log(venues);
      return venues;
    }
    throw new Error('Something went wrong with Foursquare API call...');
  } catch(error) {
    console.log(error);
  }
}

const getForecast = async () => {
  try {
    const city = $input.val();
    const urlToFetch = `${weatherUrl}?q=${city}&APPID=${openWeatherKey}`;
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = response.json();
      // console.log(jsonResponse);
      return jsonResponse;
    }
    throw new Error('Something went wrong with weather API call...');
  } catch (error) {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $destination.append(`<h2>${venues[0].location.city}</h2>`);

  //Create random sequence of venues of length 9 between 0 and 24 inclusive
  let venueIndicesArr = [...Array(venues.length).keys()];
  if (venues.length >= 9) {
    const venueIndices = new Set();
    while(venueIndices.size !== 9) {
      venueIndices.add(Math.floor(Math.random() * numVenuesToFetch));
    }
    venueIndicesArr = [...venueIndices];
  }

  for (let i = 0; i < $venueDivs.length; i++) {
    let $venue = $venueDivs[i];
    if (!venueIndicesArr.length)
      break;
    const venueIx = venueIndicesArr.shift();
    const venue = venues[venueIx];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  };
}

const renderForecast = (day) => {
  // Add your code here:
  console.log(day);
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  getForecast().then((forecast) => {
    renderForecast(forecast);
  });
  $container.css("visibility", "visible");
  getVenues().then((venues) => {
    renderVenues(venues);
  });
  return false;
}

$submit.click(executeSearch)