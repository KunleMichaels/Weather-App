import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search city')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search city');
    fireEvent.change(input, { target: { value: 'London' } });
    
    expect(input).toHaveValue('London');
  });

  it('calls onSearch with input value when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search city');
    fireEvent.change(input, { target: { value: 'London' } });
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('London');
    expect(input).toHaveValue(''); // Input should be cleared after submission
  });

  it('does not call onSearch when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});