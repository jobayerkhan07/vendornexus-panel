import { __setNumbers, getActiveNumbers, updateExpiredNumbers, NumberRecord, __stopInterval } from "@/api/numbers";

describe("numbers API", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
    const data: NumberRecord[] = [
      {
        id: "1",
        number: "+1-555-0001",
        vendor: "Twilio",
        user: "test@example.com",
        purchaseDate: "2025-01-01",
        expiryDate: "2025-01-02",
        status: "active",
        smsReceived: 0,
        cost: "$0.00",
        expired: false,
      },
      {
        id: "2",
        number: "+1-555-0002",
        vendor: "Twilio",
        user: "test2@example.com",
        purchaseDate: "2025-01-01",
        expiryDate: "2024-12-31",
        status: "active",
        smsReceived: 0,
        cost: "$0.00",
        expired: false,
      },
    ];
    __setNumbers(data);
  });

  afterEach(() => {
    __stopInterval();
    jest.useRealTimers();
  });

  it("filters out already expired numbers", async () => {
    updateExpiredNumbers();
    const active = await getActiveNumbers();
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe("1");
  });

  it("marks numbers as expired when date passes", async () => {
    updateExpiredNumbers();
    let active = await getActiveNumbers();
    expect(active).toHaveLength(1);

    jest.setSystemTime(new Date("2025-01-03T00:00:00Z"));
    updateExpiredNumbers();
    active = await getActiveNumbers();
    expect(active).toHaveLength(0);
  });
});
