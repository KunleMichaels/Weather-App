import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock the custom hook
jest.mock('../utils/useFavourites', () => {
  return jest.fn(() => ({
    favorites: ['London'],
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    fetchFavoriteWeather: jest.fn().mockResolvedValue([{
      name: 'London',
      main: { temp: 20 },
      weather: [{ description: 'cloudy' }],
      wind: { speed: 5 }
    }])
  }));
});

describe('Home', () => {
  const mockWeatherData = {
    name: 'Tokyo',
    main: { temp: 25, humidity: 60 },
    weather: [{ description: 'sunny' }],
    wind: { speed: 4 }
  };

  beforeEach(() => {
    // Mock fetch for weather API calls
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData)
      })
    );

    // Mock environment variable
    process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = 'mock-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Search for a city to see the weather')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('fetches and displays weather data when searching for a city', async () => {
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText('sunny')).toBeInTheDocument();
    });
  });

  it('displays error message when city is not found', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'City not found' })
      })
    );

    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'NonExistentCity' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('City not found')).toBeInTheDocument();
    });
  });

  it('toggles temperature unit correctly', async () => {
    render(<Home />);
    
    // Search for a city first
    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });

    // Toggle to Fahrenheit
    const fahrenheitButton = screen.getByTestId('unit-toggle-checkbox');
    fireEvent.click(fahrenheitButton);

    // Verify that a new API call was made with imperial units
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('units=imperial')
    );
  });

  it('displays favorite cities', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Error fetching weather data')).toBeInTheDocument();
    });
  });
});