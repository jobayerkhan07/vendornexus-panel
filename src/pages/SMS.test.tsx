import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import SMS from './SMS';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test('loads and displays SMS from API', async () => {
  const mockSMS = [
    {
      id: '1',
      number: '+1-555-0000',
      user: 'john@example.com',
      message: 'hi',
      sender: 'tester',
      receivedAt: 'now',
      status: 'delivered',
      cost: '$0.01'
    }
  ];

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockSMS,
  });

  renderWithClient(<SMS />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('+1-555-0000')).toBeInTheDocument());
});
