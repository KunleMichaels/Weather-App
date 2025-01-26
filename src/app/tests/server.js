import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    http.get('https://api.openweathermap.org/data/2.5/weather', () => {
      return HttpResponse.json({
        name: 'London',
        main: { temp: 15, humidity: 60 },
        wind: { speed: 5 },
        weather: [{ description: 'Clear sky' }],
      });
    })
  );

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server };
