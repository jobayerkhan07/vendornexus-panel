import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CreditCard, DollarSign, TrendingUp, Calendar } from "lucide-react";

const mockPayments = [
  { 
    id: 1, 
    user: "john@example.com", 
    amount: "$100.00", 
    type: "Credit", 
    method: "Manual", 
    date: "2024-01-15",
    status: "Completed",
    reference: "PAY-001"
  },
  { 
    id: 2, 
    user: "sarah@reseller.com", 
    amount: "$250.00", 
    type: "Credit", 
    method: "Manual", 
    date: "2024-01-14",
    status: "Completed",
    reference: "PAY-002"
  },
  { 
    id: 3, 
    user: "mike@user.com", 
    amount: "$50.00", 
    type: "Debit", 
    method: "Auto", 
    date: "2024-01-13",
    status: "Processing",
    reference: "PAY-003"
  },
];

const columns = [
  { key: "reference" as const, label: "Reference" },
  { key: "user" as const, label: "User" },
  { key: "amount" as const, label: "Amount" },
  { 
    key: "type" as const, 
    label: "Type",
    render: (value: string) => (
      <Badge variant={value === "Credit" ? "default" : "destructive"}>
        {value}
      </Badge>
    )
  },
  { key: "method" as const, label: "Method" },
  { key: "date" as const, label: "Date" },
  { 
    key: "status" as const, 
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Completed" ? "default" : "secondary"}>
        {value}
      </Badge>
    )
  },
];

export default function PaymentGateway() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Gateway</h1>
          <p className="text-muted-foreground">Manage manual payments and transactions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate mr-2">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate mr-2">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate mr-2">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate mr-2">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Manual Payment</CardTitle>
            <CardDescription>
              Add credit or debit for users manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">john@example.com</SelectItem>
                  <SelectItem value="user2">sarah@reseller.com</SelectItem>
                  <SelectItem value="user3">mike@user.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Payment Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" placeholder="Payment reference" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Payment notes or description"
                rows={3}
              />
            </div>
            <Button className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Recent payment activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Today's Transactions</p>
                  <p className="text-sm text-muted-foreground">Credits and debits</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">24</p>
                  <p className="text-sm text-green-600">+$850.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Pending Reviews</p>
                  <p className="text-sm text-muted-foreground">Manual verification needed</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">3</p>
                  <p className="text-sm text-yellow-600">$150.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Failed Transactions</p>
                  <p className="text-sm text-muted-foreground">Require attention</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">1</p>
                  <p className="text-sm text-red-600">-$25.00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            All payment transactions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={mockPayments} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}