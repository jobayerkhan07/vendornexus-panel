export interface NumberRecord {
  id: string;
  number: string;
  vendor: string;
  user: string;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  smsReceived: number;
  cost: string;
  expired: boolean;
}

let numbers: NumberRecord[] = [
  {
    id: "1",
    number: "+1-555-0123",
    vendor: "Twilio",
    user: "john.doe@example.com",
    purchaseDate: "2025-01-10",
    expiryDate: "2025-12-10",
    status: "active",
    smsReceived: 15,
    cost: "$15.00",
    expired: false,
  },
  {
    id: "2",
    number: "+1-555-0456",
    vendor: "MessageBird",
    user: "jane.smith@example.com",
    purchaseDate: "2025-01-12",
    expiryDate: "2025-11-12",
    status: "active",
    smsReceived: 8,
    cost: "$12.00",
    expired: false,
  },
  {
    id: "3",
    number: "+1-555-0789",
    vendor: "Twilio",
    user: "-",
    purchaseDate: "2025-01-08",
    expiryDate: "2025-07-01",
    status: "active",
    smsReceived: 0,
    cost: "$15.00",
    expired: false,
  },
];

export function updateExpiredNumbers() {
  const now = new Date();
  numbers = numbers.map((n) => {
    if (!n.expired && new Date(n.expiryDate) <= now) {
      return { ...n, expired: true, status: "expired" };
    }
    return n;
  });
}

// periodically refresh expired flags
const interval = setInterval(updateExpiredNumbers, 60 * 1000);

export async function getNumbers(): Promise<NumberRecord[]> {
  updateExpiredNumbers();
  return numbers;
}

export async function getActiveNumbers(): Promise<NumberRecord[]> {
  const nums = await getNumbers();
  return nums.filter((n) => !n.expired);
}

// utilities for testing
export function __setNumbers(data: NumberRecord[]) {
  numbers = data;
}

export function __stopInterval() {
  clearInterval(interval);
}
