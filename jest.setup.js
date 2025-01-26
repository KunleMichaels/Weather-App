import '@testing-library/jest-dom';
import { server } from './src/app/tests/server';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());