interface FavouritesProps {
    weather: {
      name: string;
      main: { temp: number; humidity: number };
      wind: { speed: number };
      weather: { description: string }[];
    };
    unit: string;
  }
  
  const Favourites: React.FC<FavouritesProps> = ({ weather, unit }) => {
    return (
      <div className="bg-white shadow rounded-lg p-5 dark:bg-gray-800 max-w-full">
        <h2 className="text-xl font-bold">{weather.name}</h2>
        <p>{weather.weather[0].description}</p>
        <p>Temp: {weather.main.temp} {unit}</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    );
  };
  
  export default Favourites;
  