import { render, screen } from '@testing-library/react';
import Favourites from '../components/Favourites';

describe('Favourites', () => {
  const mockWeatherData = {
    name: 'London',
    main: {
      temp: 20.5,
      humidity: 65
    },
    wind: {
      speed: 4.2
    },
    weather: [
      {
        description: 'scattered clouds'
      }
    ]
  };

  it('renders weather information correctly', () => {
    render(<Favourites weather={mockWeatherData} unit="°C" />);

    // Check if city name is displayed
    expect(screen.getByText('London')).toBeInTheDocument();

    // Check if weather description is displayed
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();

    // Check if temperature is displayed with correct unit
    expect(screen.getByText('Temp: 20.5 °C')).toBeInTheDocument();

    // Check if humidity is displayed
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();

    // Check if wind speed is displayed
    expect(screen.getByText('Wind: 4.2 m/s')).toBeInTheDocument();
  });

  it('displays temperatures with different units', () => {
    const { rerender } = render(<Favourites weather={mockWeatherData} unit="°F" />);
    expect(screen.getByText('Temp: 20.5 °F')).toBeInTheDocument();

    rerender(<Favourites weather={mockWeatherData} unit="°C" />);
    expect(screen.getByText('Temp: 20.5 °C')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<Favourites weather={mockWeatherData} unit="°C" />);
    
    const container = screen.getByRole('heading', { name: 'London' }).parentElement;
    expect(container).toHaveClass(
      'bg-white',
      'shadow',
      'rounded-lg',
      'p-5',
      'dark:bg-gray-800',
      'max-w-full'
    );
  });
});