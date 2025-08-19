import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import Users from './Users';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test('loads and displays users from API', async () => {
  const mockUsers = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John',
      role: 'User',
      status: 'active',
      balance: 10,
      lastActive: '2024-01-01',
      smsCount: 5,
      priceGroup: 'Standard',
    },
  ];

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockUsers,
  });

  renderWithClient(<Users />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
});
