import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => cleanup());

describe('App routes', () => {
  const routes = [
    { path: '/sell-price-groups', heading: 'Sell Price Groups' },
    { path: '/payments', heading: 'Payment Gateway' },
    { path: '/smtp', heading: 'SMTP' },
    { path: '/campaigns', heading: 'Campaigns' },
    { path: '/vendor-apis', heading: 'Vendor APIs' }
  ];

  routes.forEach(({ path, heading }) => {
    test(`${path} renders without crashing`, () => {
      window.history.pushState({}, '', path);
      render(<App />);
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    });
  });
});
