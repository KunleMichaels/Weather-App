import Image from "next/image";

interface WeatherCardProps {
    weather: {
      name: string;
      main: { temp: number; humidity: number };
      wind: { speed: number };
      weather: { description: string, icon: string }[];
    };
    unit: string;
  }
  
  const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit }) => {
    return (
        <div className="card bg-white text-black p-5 flex flex-col rounded-lg justify-center items-center mt-10">
          <h4 className="text-2xl" data-testid="weather-card-weather-name">{weather.name}</h4>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            data-testid="weather-card-weather-icon"
            alt=""
            width={150}
            height={150}
            className="w-[150px]"
          />
          <h2 className="text-5xl font-bold mb-2" data-testid="weather-card-weather-temp">{weather.main.temp}{unit}</h2>
          <p className="text-xl" data-testid="weather-card-weather-description">{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    );
  };
  
  export default WeatherCard;
  