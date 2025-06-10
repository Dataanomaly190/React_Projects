import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";
import moment from "moment";
import search_btn from "./Assets/search_btn.png";
import pressure from "./Assets/pressure.png";
import humidity from "./Assets/humidity.png";
import sunrise from "./Assets/sunrise.png";
import sunset from "./Assets/sunset.png";
import Sea_Level from "./Assets/sea_level.png";
import Ground_Level from "./Assets/ground_level.png";
import WindSpeed from "./Assets/wind.png";
import Gust from "./Assets/gust.png";
import WindDegree from "./Assets/compass.png";
import "./App.css";
import ClearSky from "./assets/Weather_Condition_Clips/Clear_Sky/Clear_Sky_Video_Clip.mp4";
import Fog from "./assets/Weather_Condition_Clips/Fog/Fog_Video_Clip.mp4";
import Hail from "./assets/Weather_Condition_Clips/Hail/Hail_Video_Clip.mp4";
import HeavyClouds from "./assets/Weather_Condition_Clips/Heavy_Clouds/Heavy_Clouds_Video_Clip.mp4";
import HeavyDrizzle from "./assets/Weather_Condition_Clips/Heavy_Drizzle/Heavy_Drizzle_Video_Clip.mp4";
import HeavyRain from "./assets/Weather_Condition_Clips/Heavy_Rain/Heavy_Rain_Video_Clip.mp4";
import HeavySnow from "./assets/Weather_Condition_Clips/Heavy_Snow/Heavy_Snow_Video_Clip.mp4";
import HeavyThunderStorm from "./assets/Weather_Condition_Clips/Heavy_ThunderStorm/Heavy_ThunderStorm_Video_Clip.mp4";
import LightClouds from "./assets/Weather_Condition_Clips/Light_Clouds/Light_Clouds_Video_Clip.mp4";
import LightDrizzle from "./assets/Weather_Condition_Clips/Light_Drizzle/Light_Drizzle_Video_Clip.mp4";
import LightRain from "./assets/Weather_Condition_Clips/Light_Rain/Light_Rain_Video_Clip.mp4";
import LightSnow from "./assets/Weather_Condition_Clips/Light_Snow/Light_Snow_Video_Clip.mp4";
import LightThunderStorm from "./assets/Weather_Condition_Clips/Light_ThunderStorm/Light_ThunderStorm_Video_Clip.mp4";
import Mist from "./assets/Weather_Condition_Clips/Mist/Mist_Video_Clip.mp4";
import ModerateClouds from "./assets/Weather_Condition_Clips/Moderate_Clouds/Moderate_Clouds_Video_Clip.mp4";
import ModerateRain from "./assets/Weather_Condition_Clips/Moderate_Rain/Moderate_Rain_Video_Clip.mp4";
import ModerateSnow from "./assets/Weather_Condition_Clips/Moderate_Snow/Moderate_Snow_Video_Clip.mp4";
import ModerateThunderStorm from "./assets/Weather_Condition_Clips/Moderate_ThunderStorm/Moderate_ThunderStorm_Video_Clip.mp4";
import RainAndSnow from "./assets/Weather_Condition_Clips/Rain_and_Snow/Rain_and_Snow_Video_Clip.mp4";
import Sand from "./assets/Weather_Condition_Clips/Sand/Sand_Video_Clip.mp4";
import Sleet from "./assets/Weather_Condition_Clips/Sleet/Sleet_Video_Clip.mp4";
import Smoge from "./assets/Weather_Condition_Clips/Smoge/Smoge_Video_Clip.mp4";
import Tornado from "./assets/Weather_Condition_Clips/Tornado/Tornado_Video_Clip.mp4";
import VolcanicAsh from "./assets/Weather_Condition_Clips/Volcanic_Ash/Volcanic_Ash_Video_Clip.mp4";

//Default Background
// import Rain from "./assets/Weather_Condition_Clips/thunderstorm_Video.mp4";
import MountainFog from "./assets/Weather_Condition_Clips/Fog_Video_Clip_One.mp4";

export default function App() {
  const [city, setcity] = useState("");
  const [WeatherData, setWeatherData] = useState({});
  const [Sunrise, setSunrise] = useState("");
  const [Sunset, setSunset] = useState("");
  const [backgroundVideo, setBackgroundVideo] = useState(MountainFog);

  const weather_icons = {
    "01d": " https://openweathermap.org/img/wn/01d@2x.png",
    "01n": " https://openweathermap.org/img/wn/01n@2x.png",
    "02d": " https://openweathermap.org/img/wn/02d@2x.png",
    "02n": " https://openweathermap.org/img/wn/02n@2x.png",
    "03d": " https://openweathermap.org/img/wn/03d@2x.png",
    "03n": " https://openweathermap.org/img/wn/03n@2x.png",
    "04d": " https://openweathermap.org/img/wn/04d@2x.png",
    "04n": " https://openweathermap.org/img/wn/04n@2x.png",
    "09d": " https://openweathermap.org/img/wn/09d@2x.png",
    "09n": " https://openweathermap.org/img/wn/09n@2x.png",
    "10d": " https://openweathermap.org/img/wn/10d@2x.png",
    "10n": " https://openweathermap.org/img/wn/10n@2x.png",
    "11d": " https://openweathermap.org/img/wn/11d@2x.png",
    "11n": " https://openweathermap.org/img/wn/11n@2x.png",
    "13d": " https://openweathermap.org/img/wn/13d@2x.png",
    "13n": " https://openweathermap.org/img/wn/13n@2x.png",
    "50d": " https://openweathermap.org/img/wn/50d@2x.png",
    "50n": " https://openweathermap.org/img/wn/50n@2x.png",
  };

  const handleWeatherData = async (city) => {
    try {
      const response = await fetch(`http://localhost:5000/weather?q=${city}`);
      const data = await response.json();
      console.log(data);

      if (data.cod !== 200) {
        throw new Error("City not found!");
      }

      const sunriseTime = moment
        .unix(data.sys.sunrise)
        .utcOffset(data.timezone / 60)
        .format("h:mm A");
      const sunsetTime = moment
        .unix(data.sys.sunset)
        .utcOffset(data.timezone / 60)
        .format("h:mm A");

      setWeatherData({
        city: data.name,
        temperature: parseInt(data.main.temp),
        temp_min: parseInt(data.main.temp_min),
        temp_max: parseInt(data.main.temp_max),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        vibe: parseInt(data.main.feels_like),
        Sea_Level: data.main.sea_level,
        ground: data.main.grnd_level,
        description: data.weather[0].description,
        icon: weather_icons[data.weather[0].icon],
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        clouds: data.clouds.all,
        sunrise: sunriseTime,
        sunset: sunsetTime,
        country: data.sys.country,
        weather_SumUp: data.weather[0].main,
        weather_info: data.description,
        wind_Speed: data.wind.speed,
        Gust: data.wind.gust,
        wind_degree: data.wind.deg,
      });
      setSunrise(sunriseTime);
      setSunset(sunsetTime);
    } catch (error) {
      console.error("City not found! ", error);
      alert("City not found. Please try again.");
      // Reset UI to default state
      setWeatherData({}); // Clear previous weather data
      setBackgroundVideo(MountainFog); // Set default background video
    }
  };

  const handlecityName = (event) => {
    const district = event.target.value;
    setcity(district);
  };

  const handleRequest = () => {
    handleWeatherData(city);
  };

  const weatherVideos = {
    "light thunderstorm": LightThunderStorm,
    "thunderstorm": LightThunderStorm,
    "ragged thunderstorm": LightThunderStorm,
    "thunderstorm with light rain": ModerateThunderStorm,
    "thunderstorm with light drizzle": ModerateThunderStorm,
    "thunderstorm with rain": ModerateThunderStorm,
    "thunderstorm with drizzle": ModerateThunderStorm,
    "heavy thunderstorm": HeavyThunderStorm,
    "thunderstorm with heavy rain": HeavyThunderStorm,
    "thunderstorm with heavy drizzle": HeavyThunderStorm,
    "squalls": HeavyThunderStorm,
    "light intensity drizzle": LightDrizzle,
    "drizzle": LightDrizzle,
    "light drizzle rain": LightDrizzle,
    "drizzle rain": LightDrizzle,
    "heavy drizzle": HeavyDrizzle,
    "heavy drizzle rain": HeavyDrizzle,
    "shower rain and drizzle": HeavyDrizzle,
    "heavy shower rain and drizzle": HeavyDrizzle,
    "shower drizzle": HeavyDrizzle,
    "light rain": LightRain,
    "light shower rain": LightRain,
    "ragged shower rain": LightRain,
    "moderate rain": ModerateRain,
    "shower rain": ModerateRain,
    "heavy intensity rain": HeavyRain,
    "very heavy rain": HeavyRain,
    "extreme rain": HeavyRain,
    "heavy shower rain": HeavyRain,
    "light snow": LightSnow,
    "snow": ModerateSnow,
    "shower snow": ModerateSnow,
    "heavy snow": HeavySnow,
    "heavy shower snow": HeavySnow,
    "freezing rain": Hail,
    "sleet": Sleet,
    "shower sleet": Sleet,
    "light shower sleet": Sleet,
    "light shower snow": Sleet,
    "light rain and snow": RainAndSnow,
    "rain and snow": RainAndSnow,
    "mist": Mist,
    "smoke": Smoge,
    "haze": Smoge,
    "dust/sand whirls": Smoge,
    "dust": Smoge,
    "fog": Fog,
    "sand": Sand,
    "volcanic ash": VolcanicAsh,
    "tornado": Tornado,
    "clear sky": ClearSky,
    "few clouds": LightClouds,
    "scattered clouds": ModerateClouds,
    "broken clouds": ModerateClouds,
    "overcast clouds": HeavyClouds,
  };

  useEffect(() => {
    const handleweathercondition = () => {
      const weatherVideo = weatherVideos[WeatherData.description.toLowerCase()];
      // console.log("Selected Weather Video: ", weatherVideo || "null");
      if (weatherVideo) {
        setBackgroundVideo(weatherVideo);
      }
    };
    if (WeatherData.description) {
      handleweathercondition();
    }

  }, [WeatherData.description]);

  return (
    <>
      <div className="video-wrapper">
        <video autoPlay loop muted playsInline key={backgroundVideo}>   {/* Using 'key' here forces a re-render */}
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="primary-div">
        <div className="title">Weather Forecast!</div>
        <div className="container">
          <div className="search_block">
            <input
              type="search"
              className="SearchBar"
              placeholder=" Enter Place..."
              value={city}
              onChange={handlecityName}
            />
            <img
              src={search_btn}
              alt="btn_img"
              className="search-btn"
              onClick={handleRequest}
            />
          </div>
          <div className="content_container">
            <div className="weather_icon">
              {WeatherData.icon && (
                <img src={WeatherData.icon} alt="Weather Icon" />
              )}
            </div>
            <div className="bottom_container">
              <span className="Temperature">{WeatherData.temperature}°C</span>
              <span className="Feels_Like">
                <strong>Feels Like:</strong> {WeatherData.vibe}°C
              </span>
              <div className="subclass_pair">
                <span className="Min_Temp">
                  <strong>Min:</strong> {WeatherData.temp_min}°C
                </span>
                <span className="Max_Temp">
                  <strong>Max:</strong> {WeatherData.temp_max}°C
                </span>
              </div>
              <span className="City">{WeatherData.city}</span>
              <div>
                <Flag code={WeatherData.country} className="country_flag" />
              </div>
            </div>
            <div className="Pairs">
              <span className="Pressure">
                <strong>Pressure:</strong> {WeatherData.pressure} hPa
                <br />
                <img
                  src={pressure}
                  alt="P_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span className="Humidity">
                <strong>Humidity:</strong> {WeatherData.humidity}%
                <br />
                <img
                  src={humidity}
                  alt="H_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
            </div>
            <div className="encapsulator">
              <div className="middle_container">
                <span className="weather">
                  <strong>Weather: </strong>
                  {WeatherData.weather_SumUp}
                </span>
                <span className="description">
                  <strong>Description: </strong>
                  {WeatherData.description}
                </span>
                <span className="speed">
                  <strong>Wind Speed: </strong>
                  {WeatherData.wind_Speed} m/s
                  <br />
                  <img
                    src={WindSpeed}
                    alt="WS_img"
                    style={{ height: "50px", width: "50px" }}
                  />
                </span>
                <span className="gust">
                  {(WeatherData.Gust && (
                    <>
                      <strong>Gust: </strong>
                      {WeatherData.Gust} m/s
                    </>
                  )) || (
                    <>
                      <strong>Gust: </strong>
                      N/A
                    </>
                  )}
                  <br />
                  <img
                    src={Gust}
                    alt="G_img"
                    style={{ height: "50px", width: "50px" }}
                  />
                </span>
                <span className="deg">
                  <strong>Wind Degree: </strong>
                  {WeatherData.wind_deg}°
                  <br />
                  <img
                    src={WindDegree}
                    alt="WD_img"
                    style={{ height: "50px", width: "50px" }}
                  />
                </span>
              </div>
            </div>
            <div className="Pairs">
              <span className="sunrise">
                <strong>Sunrise:</strong> {Sunrise}
                <br />
                <img
                  src={sunrise}
                  alt="H_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span className="sunset">
                <strong>Sunset:</strong> {Sunset}
                <br />
                <img
                  src={sunset}
                  alt="H_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
            </div>
            <div className="Pairs">
              <span className="Sea_Level">
                <strong>Sea Level:</strong> {WeatherData.Sea_Level} m
                <br />
                <img
                  src={Sea_Level}
                  alt="P_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span className="Ground_Level">
                <strong>Ground Level:</strong> {WeatherData.ground} m
                <br />
                <img
                  src={Ground_Level}
                  alt="P_img"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
