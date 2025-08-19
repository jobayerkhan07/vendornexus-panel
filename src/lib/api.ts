export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  balance: number;
  lastActive: string;
  smsCount: number;
  priceGroup: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  status: string;
  purchasePrice: string;
  inboundPrice: string;
  numbersAvailable: number;
  totalPurchased: number;
  lastSync: string;
}

export interface NumberItem {
  id: string;
  number: string;
  vendor: string;
  user: string;
  purchaseDate: string;
  expiryDate: string;
  status: string;
  smsReceived: number;
  cost: string;
}

export interface SMSMessage {
  id: string;
  number: string;
  user: string;
  message: string;
  sender: string;
  receivedAt: string;
  status: string;
  cost: string;
}

export interface Metrics {
  totalUsers: number;
  activeNumbers: number;
  smsReceived: number;
  revenue: string;
  userGrowth: string;
  smsGrowth: string;
  revenueGrowth: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  details: string;
  amount: string;
  timestamp: string;
  status: string;
}

export interface RevenueRecord {
  period: string;
  amount: number;
  growth: string;
}

const baseFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
};

export const api = {
  users: {
    list: () => baseFetch<User[]>("/api/users"),
    create: (data: Partial<User>) =>
      baseFetch<User>("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<User>) =>
      baseFetch<User>(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      baseFetch<void>(`/api/users/${id}`, { method: "DELETE" }),
  },
  vendors: {
    list: () => baseFetch<Vendor[]>("/api/vendors"),
    create: (data: Partial<Vendor>) =>
      baseFetch<Vendor>("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Vendor>) =>
      baseFetch<Vendor>(`/api/vendors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      baseFetch<void>(`/api/vendors/${id}`, { method: "DELETE" }),
  },
  numbers: {
    list: () => baseFetch<NumberItem[]>("/api/numbers"),
    create: (data: Partial<NumberItem>) =>
      baseFetch<NumberItem>("/api/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<NumberItem>) =>
      baseFetch<NumberItem>(`/api/numbers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      baseFetch<void>(`/api/numbers/${id}`, { method: "DELETE" }),
  },
  sms: {
    list: () => baseFetch<SMSMessage[]>("/api/sms"),
  },
  dashboard: {
    metrics: () => baseFetch<Metrics>("/api/metrics"),
    recentActivity: () => baseFetch<Activity[]>("/api/recent-activity"),
  },
  reports: {
    revenue: (type: string, range: string) =>
      baseFetch<RevenueRecord[]>(`/api/reports/${type}?range=${range}`),
  },
};

export default api;
