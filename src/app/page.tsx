'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import useFavorites from './utils/useFavourites';
import UnitToggle from './components/UnitToggle';
import { Weather } from './types';
import Favourites from './components/Favourites';

export default function Home() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const { favorites, addFavorite, removeFavorite, fetchFavoriteWeather } = useFavorites(unit);
  const [favoritesWeather, setFavoritesWeather] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavoriteWeather().then(setFavoritesWeather);
    if (weather) {
      fetchWeather(weather.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, favorites]);

  const fetchWeather = async (city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.error('API key is missing');
      return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError(null);
      } else {
        setError(data.message || 'City not found');
        setWeather(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Error fetching weather data');
      setWeather(null);
    }
  };

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="p-6 p-5 bg-white dark:bg-gray-900 antialiased min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Dashboard</h1>
      <div className="max-w-md mx-auto">
        <SearchBar onSearch={fetchWeather} />
        <UnitToggle unit={unit} onToggle={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')} />
      </div>

      {weather ? (
        <div className="mt-6 max-w-md mx-auto">
          <WeatherCard weather={weather} unit={tempUnit} />
          <button
            onClick={() => addFavorite(weather.name)}
            className="mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Add to Favorites
          </button>
        </div>
      )
      :
      <div className="mt-6 max-w-md mx-auto">
        <h2 className={`text-xl font-semibold ${error ? 'text-red-500' : ''}`}>
          {error ? error : "Search for a city to see the weather"}
        </h2>
      </div>
    }

      <div className="mt-6 max-w-md mx-auto">
        <h2 className={`text-xl font-semibold ${favoritesWeather.length > 0 ? 'text-green-500' : ''}`}>
          {favoritesWeather.length > 0 ? 'Favorites' : 'No favorites yet'}
        </h2>
        {favoritesWeather.map((cityWeather) => (
          <div key={cityWeather.name} className="p-2 rounded-md mt-2">
            <Favourites weather={cityWeather} unit={tempUnit} />
            <button
              onClick={() => removeFavorite(cityWeather.name)}
              className="text-red-500 font-bold w-full mt-2"
              data-testid={`remove-favorite-button-${cityWeather.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}