import { render, screen, fireEvent } from '@testing-library/react';
import UnitToggle from '../components/UnitToggle';

describe('UnitToggle', () => {
  it('renders with correct initial state for metric units', () => {
    const mockOnToggle = jest.fn();
    render(<UnitToggle unit="metric" onToggle={mockOnToggle} />);

    const checkbox = screen.getByRole('checkbox');
    const celsiusLabel = screen.getByText('°C');
    const fahrenheitLabel = screen.getByText('°F');

    expect(checkbox).not.toBeChecked();
    expect(celsiusLabel).toBeInTheDocument();
    expect(fahrenheitLabel).toBeInTheDocument();
  });

  it('renders with correct initial state for imperial units', () => {
    const mockOnToggle = jest.fn();
    render(<UnitToggle unit="imperial" onToggle={mockOnToggle} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onToggle when clicked', () => {
    const mockOnToggle = jest.fn();
    render(<UnitToggle unit="metric" onToggle={mockOnToggle} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('maintains accessibility features', () => {
    const mockOnToggle = jest.fn();
    render(<UnitToggle unit="metric" onToggle={mockOnToggle} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'switch-component-on');
    
    // Check if labels are properly associated with the checkbox
    const labels = screen.getAllByText(/(°C|°F)/);
    labels.forEach(label => {
      expect(label).toHaveAttribute('for', 'switch-component-on');
    });
  });
});