import { render, screen, waitFor } from "@testing-library/react";
import NumberPool from "./NumberPool";
import * as numbersApi from "@/api/numbers";

describe("NumberPool", () => {
  it("hides expired numbers", async () => {
    jest.spyOn(numbersApi, "getNumbers").mockResolvedValue([
      {
        id: "1",
        number: "+1-555-0001",
        vendor: "Twilio",
        user: "test@example.com",
        purchaseDate: "2025-01-01",
        expiryDate: "2025-12-31",
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
        status: "expired",
        smsReceived: 0,
        cost: "$0.00",
        expired: true,
      },
    ]);

    render(<NumberPool />);

    await waitFor(() => {
      expect(screen.getByText("+1-555-0001")).toBeInTheDocument();
    });
    expect(screen.queryByText("+1-555-0002")).toBeNull();
  });

  afterEach(() => {
    numbersApi.__stopInterval();
    jest.useRealTimers();
  });
});
