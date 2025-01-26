# Weather Dashboard

A responsive weather dashboard application built with Next.js that allows users to search for weather information by city and manage their favorite locations.

## Features

- 🔍 Search weather information by city name
- 🌡️ Toggle between Celsius and Fahrenheit
- ⭐ Save favorite cities for quick access
- 💾 Persistent favorites storage
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Testing**: Jest & React Testing Library
- **API**: OpenWeatherMap API
- **State Management**: React Hooks
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenWeatherMap API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/KunleMichaels/Weather-App.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install or yarn install
```

3. Create a `.env.local` and `.env.test` file in the root directory and add your OpenWeatherMap API key:

```bash
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your-api-key
```

### Running the Application

Development mode:

```bash
npm run dev or yarn dev
```

Build and run production mode:

```bash
npm run build && npm run start
```

The application will be available at `http://localhost:3000`

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```

Note: The tests are configured to use the API key from the `.env.test` file.

## Project Structure

src/
├── app/
│ ├── components/ # React components
│ ├── utils/ # Utility functions and hooks
│ ├── types/ # TypeScript type definitions
│ └── tests/ # Test files
├── public/ # Static assets
└── styles/ # Global styles


## Solution Overview

### Architecture

The application follows a component-based architecture with:
- Stateful parent components managing data flow
- Reusable UI components
- Custom hooks for business logic
- TypeScript for type safety
- Jest for testing

### Key Components

- **SearchBar**: Handles city search functionality
- **WeatherCard**: Displays current weather information
- **UnitToggle**: Toggles temperature units
- **Favorites**: Manages favorite cities list

### State Management

- Uses React's useState and useEffect hooks
- Custom useFavorites hook for managing favorite cities
- Local storage for persistence

### Testing Strategy

- Unit tests for individual components
- Integration tests for component interactions
- Custom hooks testing
- Mock service worker for API testing
- API integration tests

## Acknowledgments

- OpenWeatherMap API for weather data
- Next.js team for the amazing framework
- Tailwind CSS for the styling system
- Jest for testing
- React Testing Library for testing
- Mock Service Worker for API testing
