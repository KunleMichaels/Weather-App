import { render, screen } from '@testing-library/react';
import WeatherCard from '../components/WeatherCard';

describe('WeatherCard', () => {
  const mockWeatherData = {
    name: 'London',
    main: {
      temp: 20.5,
      humidity: 65,
    },
    wind: {
      speed: 4.2,
    },
    weather: [
      {
        description: 'scattered clouds',
        icon: '03d',
      },
    ],
  };

  it('renders weather information correctly', () => {
    render(<WeatherCard weather={mockWeatherData} unit="°C" />);

    // Check if city name is displayed
    expect(screen.getByText('London')).toBeInTheDocument();

    // Check if temperature is displayed correctly
    expect(screen.getByText('20.5°C')).toBeInTheDocument();

    // Check if weather description is displayed
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();

    // Check if humidity is displayed
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();

    // Check if wind speed is displayed
    expect(screen.getByText('Wind: 4.2 m/s')).toBeInTheDocument();
  });

  it('renders weather icon with correct URL', () => {
    render(<WeatherCard weather={mockWeatherData} unit="°C" />);

    const weatherIcon = screen.getByTestId('weather-card-weather-icon');
    expect(weatherIcon).toHaveAttribute(
      'src',
      expect.stringContaining('/_next/image?url=https%3A%2F%2Fopenweathermap.org%2Fimg%2Fwn%2F03d%402x.png&w=384&q=75')
    );
  });

  it('displays temperatures with different units', () => {
    const { rerender } = render(<WeatherCard weather={mockWeatherData} unit="°F" />);
    expect(screen.getByText('20.5°F')).toBeInTheDocument();

    rerender(<WeatherCard weather={mockWeatherData} unit="°C" />);
    expect(screen.getByText('20.5°C')).toBeInTheDocument();
  });
});