import { renderHook, act } from '@testing-library/react';
import useFavorites from '../utils/useFavourites';

describe('useFavorites', () => {
  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  // Mock fetch
  const mockFetch = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    // Ensure localStorage.getItem returns null by default
    mockLocalStorage.getItem.mockReturnValue(null);

    // Setup fetch mock
    global.fetch = mockFetch;
    
    // Mock environment variable
    process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = 'mock-api-key';
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = 'mock-api-key';
  });

  it('initializes with stored favorites from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('["London","Paris"]');
    
    const { result } = renderHook(() => useFavorites('metric'));
    
    expect(result.current.favorites).toEqual(['London', 'Paris']);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('favorites');
  });

  it('adds a new favorite city', () => {
    const { result } = renderHook(() => useFavorites('metric'));
    
    act(() => {
      result.current.addFavorite('Tokyo');
    });
    
    expect(result.current.favorites).toContain('Tokyo');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify(['Tokyo'])
    );
  });

  it('prevents duplicate favorites', () => {
    // Set up initial state as empty array
    mockLocalStorage.getItem.mockReturnValue('[]');
    const { result } = renderHook(() => useFavorites('metric'));
    
    act(() => {
      result.current.addFavorite('Tokyo');
    });
    act(() => {
      result.current.addFavorite('Tokyo');
    });
    
    expect(result.current.favorites).toEqual(['Tokyo']);
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('removes a favorite city', () => {
    mockLocalStorage.getItem.mockReturnValue('["London","Paris"]');
    
    const { result } = renderHook(() => useFavorites('metric'));
    
    act(() => {
      result.current.removeFavorite('London');
    });
    
    expect(result.current.favorites).not.toContain('London');
    expect(result.current.favorites).toContain('Paris');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify(['Paris'])
    );
  });

  it('fetches weather data for favorite cities', async () => {
    mockLocalStorage.getItem.mockReturnValue('["London"]');
    
    const mockWeatherData = {
      name: 'London',
      main: { temp: 20 },
      weather: [{ description: 'cloudy' }],
    };

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockWeatherData),
    });

    const { result } = renderHook(() => useFavorites('metric'));

    let weatherData;
    await act(async () => {
      weatherData = await result.current.fetchFavoriteWeather();
    });

    expect(weatherData).toEqual([mockWeatherData]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org/data/2.5/weather?q=London&units=metric')
    );
  });

  it('filters out error responses when fetching weather', async () => {
    mockLocalStorage.getItem.mockReturnValue('["London","InvalidCity"]');
    
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ name: 'London', main: { temp: 20 } }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ error: 'City not found' }),
      });

    const { result } = renderHook(() => useFavorites('metric'));

    let weatherData;
    await act(async () => {
      weatherData = await result.current.fetchFavoriteWeather();
    });
    expect(weatherData).toHaveLength(1);
    expect(weatherData?.[0]).toEqual({ name: 'London', main: { temp: 20 } });
  });
});
