import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import Vendors from './Vendors';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test('loads and displays vendors from API', async () => {
  const mockVendors = [
    {
      id: '1',
      name: 'Twilio',
      type: 'API',
      status: 'active',
      purchasePrice: '$1',
      inboundPrice: '$0',
      numbersAvailable: 10,
      totalPurchased: 20,
      lastSync: 'now'
    }
  ];

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockVendors,
  });

  renderWithClient(<Vendors />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Twilio')).toBeInTheDocument());
});
