import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

describe('Weather API Integration Tests', () => {
  // Don't mock fetch - use real API calls
  const REAL_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  beforeAll(() => {
    // Verify API key exists
    if (!REAL_API_KEY) {
      throw new Error('API key is required for integration tests');
    }
  });

  it('fetches real weather data from the API', async () => {
    render(<Home />);

    const searchInput = screen.getByPlaceholderText('Search city');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    // Wait for real API response
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    }, { timeout: 5000 }); // Longer timeout for real API calls

    // Verify real weather data properties exist
    expect(screen.getByTestId('weather-card-weather-temp')).toBeInTheDocument();
    expect(screen.getByTestId('weather-card-weather-description')).toBeInTheDocument();
  });
});