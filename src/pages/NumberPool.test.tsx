import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import NumberPool from './NumberPool';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test('loads and displays numbers from API', async () => {
  const mockNumbers = [
    {
      id: '1',
      number: '+1-555-0000',
      vendor: 'Twilio',
      user: 'john@example.com',
      purchaseDate: '2024-01-01',
      expiryDate: '2024-02-01',
      status: 'active',
      smsReceived: 0,
      cost: '$1'
    }
  ];

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockNumbers,
  });

  renderWithClient(<NumberPool />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('+1-555-0000')).toBeInTheDocument());
});
