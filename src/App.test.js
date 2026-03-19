import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weather search interface', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /weather/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search any city/i)).toBeInTheDocument();
});
