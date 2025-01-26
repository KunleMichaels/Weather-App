import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

describe('Weather Dashboard Integration Tests', () => {
  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  // Mock weather data responses
  const mockTokyoWeather = {
    name: 'Tokyo',
    main: { temp: 25, humidity: 60 },
    weather: [{ description: 'sunny' }],
    wind: { speed: 4 }
  };

  const mockLondonWeather = {
    name: 'London',
    main: { temp: 15, humidity: 75 },
    weather: [{ description: 'cloudy' }],
    wind: { speed: 6 }
  };

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    mockLocalStorage.getItem.mockReturnValue('[]'); // Start with empty favorites

    // Mock environment variable
    process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = 'mock-api-key';

    // Mock fetch for weather API calls
    global.fetch = jest.fn()
      .mockImplementation((url) => {
        if (url.includes('Tokyo')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTokyoWeather)
          });
        } else if (url.includes('London')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockLondonWeather)
          });
        }
        return Promise.reject(new Error('Invalid city'));
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('completes full user journey', async () => {
    render(<Home />);

    // 1. Initial state check
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Search for a city to see the weather')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();

    // 2. Search for Tokyo
    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    // 3. Verify Tokyo weather is displayed
    await waitFor(() => {
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText('sunny')).toBeInTheDocument();
    });

    // 4. Add Tokyo to favorites
    const addToFavoritesButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(addToFavoritesButton);

    // 5. Verify Tokyo appears in favorites
    await waitFor(() => {
      const favoriteCards = screen.getAllByText('Tokyo');
      expect(favoriteCards.length).toBe(2); // One in main display, one in favorites
    });

    // 6. Change temperature unit to Fahrenheit
    const fahrenheitButton = screen.getByTestId('unit-toggle-checkbox');
    fireEvent.click(fahrenheitButton);

    // 7. Verify temperature unit changed
    await waitFor(() => {
      expect(screen.queryByText('25°C')).not.toBeInTheDocument();
      expect(screen.getByTestId('weather-card-weather-temp')).toHaveTextContent('25°F');
    });

    // 8. Search for London
    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    // 9. Verify London weather is displayed
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText(/cloudy/)).toBeInTheDocument();
    });

    // 10. Add London to favorites
    fireEvent.click(addToFavoritesButton);

    // 11. Verify both cities are in favorites
    await waitFor(() => {
      expect(screen.getAllByText('Tokyo').length).toBeGreaterThan(0);
      expect(screen.getAllByText('London').length).toBeGreaterThan(0);
    });

    // 12. Remove Tokyo from favorites
    const tokyoRemoveButton = screen.getByTestId(`remove-favorite-button-Tokyo`);
    fireEvent.click(tokyoRemoveButton);

    // 13. Verify Tokyo is removed from favorites but London remains
    await waitFor(() => {
      const tokyoInstances = screen.getAllByText('Tokyo');
      expect(tokyoInstances.length).toBe(1); // Only in main display
      expect(screen.getAllByText('London').length).toBeGreaterThan(0);
    });

    // 14. Test error handling with invalid city
    fireEvent.change(searchInput, { target: { value: 'InvalidCity' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    // Mock a network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<Home />);

    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Error fetching weather data')).toBeInTheDocument();
    });
  });

  it('persists favorites across sessions', async () => {
    // Mock localStorage with existing favorites
    mockLocalStorage.getItem.mockReturnValue('["Tokyo"]');

    render(<Home />);

    // Verify favorite city is loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
    });
  });
});