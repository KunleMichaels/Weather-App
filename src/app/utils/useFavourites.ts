'use client';

import { useState, useEffect } from 'react';

const useFavorites = (unit: 'metric' | 'imperial') => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const addFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (city: string) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const fetchFavoriteWeather = async () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) return [];
    const weatherData = await Promise.all(
      favorites.map(async (city) => {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
        return res.json();
      })
    );
    return weatherData.filter((data) => !data.error);
  };

  return { favorites, addFavorite, removeFavorite, fetchFavoriteWeather };
};

export default useFavorites;