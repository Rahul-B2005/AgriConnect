const axios = require('axios');

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

const WEATHER_CODES = {
  0:{label:'Clear sky',advisory:'Good conditions for spraying or harvesting.'},
  1:{label:'Mainly clear',advisory:'Good conditions for most field work.'},
  2:{label:'Partly cloudy',advisory:'Fine for field work; watch the afternoon sky.'},
  3:{label:'Overcast',advisory:'Reduced sunlight — fine for transplanting, less ideal for drying harvest.'},
  45:{label:'Fog',advisory:'Delay spraying until visibility and humidity drop.'},
  48:{label:'Depositing rime fog',advisory:'Delay spraying until fog clears.'},
  51:{label:'Light drizzle',advisory:'Hold off on spraying — it will wash off.'},
  53:{label:'Drizzle',advisory:'Hold off on spraying and pesticide application.'},
  55:{label:'Dense drizzle',advisory:'Avoid field spraying today.'},
  61:{label:'Slight rain',advisory:'Postpone irrigation — natural rainfall covers it.'},
  63:{label:'Rain',advisory:'Postpone irrigation and any spraying.'},
  65:{label:'Heavy rain',advisory:'Check drainage in low-lying fields; hold all spraying.'},
  71:{label:'Slight snow',advisory:'Not typical for this region — verify local advisory.'},
  80:{label:'Rain showers',advisory:'Keep harvested produce covered and dry.'},
  81:{label:'Moderate showers',advisory:'Keep harvested produce covered and dry.'},
  82:{label:'Violent showers',advisory:'Secure loose equipment and delay outdoor work.'},
  95:{label:'Thunderstorm',advisory:'Avoid open fields until the storm passes.'},
  96:{label:'Thunderstorm',advisory:'Avoid open fields and protect equipment from hail.'},
  99:{label:'Thunderstorm',advisory:'Avoid open fields and protect equipment from hail.'},
};

function codeInfo(code) {
  return WEATHER_CODES[code] || {label:'Mixed conditions',advisory:'Check local updates before major field work.'};
}

async function getPlaceByCoordinates(latitude, longitude) {
  const reverse = await axios.get(REVERSE_URL, {
    params: { lat: latitude, lon: longitude, format: 'json', zoom: 10, addressdetails: 1 },
    headers: { 'User-Agent': 'AgriConnect/2.0 agriculture weather application' },
    timeout: 8000,
  });
  const address = reverse.data.address || {};
  const name = address.city || address.town || address.village || address.county || reverse.data.display_name?.split(',')[0] || 'My location';
  const region = address.state || address.state_district || '';
  return { name, admin1: region, latitude: Number(latitude), longitude: Number(longitude) };
}

exports.getWeather = async (req, res) => {
  try {
    const { location, latitude, longitude } = req.query;
    let place;

    if (latitude !== undefined && longitude !== undefined) {
      const lat = Number(latitude);
      const lon = Number(longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return res.status(400).json({ message: 'Invalid latitude or longitude.' });
      }
      try { place = await getPlaceByCoordinates(lat, lon); }
      catch { place = { name: 'My live location', admin1: '', latitude: lat, longitude: lon }; }
    } else {
      if (!location) return res.status(400).json({ message: 'Provide a location or live latitude/longitude.' });
      const geoRes = await axios.get(GEOCODE_URL, { params: { name: location, count: 1, language: 'en', format: 'json' } });
      const result = geoRes.data.results?.[0];
      if (!result) return res.status(404).json({ message: `Could not find location "${location}"` });
      place = result;
    }

    const forecastRes = await axios.get(FORECAST_URL, {
      params: {
        latitude: place.latitude,
        longitude: place.longitude,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    const current = forecastRes.data.current;
    const daily = forecastRes.data.daily;
    const days = daily.time.map((date, i) => ({ date, maxTemp: daily.temperature_2m_max[i], minTemp: daily.temperature_2m_min[i], rainChance: daily.precipitation_probability_max[i], ...codeInfo(daily.weather_code[i]) }));

    res.json({
      location: `${place.name}${place.admin1 ? ', ' + place.admin1 : ''}`,
      coordinates: { latitude: Number(place.latitude), longitude: Number(place.longitude) },
      current: { temperature: current.temperature_2m, humidity: current.relative_humidity_2m, windSpeed: current.wind_speed_10m, precipitation: current.precipitation, ...codeInfo(current.weather_code) },
      forecast: days,
      source: 'Open-Meteo + OpenStreetMap (live)',
    });
  } catch (err) {
    res.status(500).json({ message: 'Live weather service error', detail: err.message });
  }
};
