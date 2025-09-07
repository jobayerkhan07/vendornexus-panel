import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DataTable } from "@/components/ui/data-table";
import { 
  Users, Phone, MessageSquare, DollarSign, 
  TrendingUp, Activity, AlertCircle 
} from "lucide-react";

// Mock data - in real app this would come from API
const mockMetrics = {
  totalUsers: 1247,
  activeNumbers: 3891,
  smsReceived: 12847,
  revenue: "$23,456",
  userGrowth: "+12.5%",
  smsGrowth: "+8.2%",
  revenueGrowth: "+15.3%"
};

const mockRecentActivity = [
  {
    id: "1",
    user: "john.doe@example.com",
    action: "Number Purchase",
    details: "+1-555-0123",
    amount: "$15.00",
    timestamp: "2 minutes ago",
    status: "completed"
  },
  {
    id: "2", 
    user: "jane.smith@example.com",
    action: "SMS Received",
    details: "Verification code",
    amount: "$0.05",
    timestamp: "5 minutes ago",
    status: "completed"
  },
  {
    id: "3",
    user: "mike.johnson@example.com",
    action: "Balance Top-up",
    details: "Manual payment",
    amount: "$100.00",
    timestamp: "12 minutes ago",
    status: "pending"
  },
  {
    id: "4",
    user: "sarah.wilson@example.com",
    action: "Number Renewal",
    details: "+1-555-0456",
    amount: "$12.00",
    timestamp: "18 minutes ago",
    status: "completed"
  },
];

const activityColumns = [
  { key: "user" as const, label: "User" },
  { key: "action" as const, label: "Action" },
  { key: "details" as const, label: "Details" },
  { key: "amount" as const, label: "Amount", render: (value: string) => (
    <span className="font-medium text-foreground">{value}</span>
  )},
  { key: "status" as const, label: "Status", render: (value: string) => (
    <span className={`status-badge ${
      value === "completed" ? "status-active" : 
      value === "pending" ? "status-pending" : "status-inactive"
    }`}>
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  )},
  { key: "timestamp" as const, label: "Time" },
];

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome to your SMS Reseller Portal. Here's an overview of your system.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <MetricsCard
          title="Total Users"
          value={mockMetrics.totalUsers.toLocaleString()}
          change={mockMetrics.userGrowth}
          changeType="positive"
          icon={Users}
          description="Active registered users"
        />
        <MetricsCard
          title="Active Numbers"
          value={mockMetrics.activeNumbers.toLocaleString()}
          change="Currently in pool"
          changeType="neutral"
          icon={Phone}
          description="Numbers ready for use"
        />
        <MetricsCard
          title="SMS Received"
          value={mockMetrics.smsReceived.toLocaleString()}
          change={mockMetrics.smsGrowth}
          changeType="positive"
          icon={MessageSquare}
          description="This month"
        />
        <MetricsCard
          title="Revenue"
          value={mockMetrics.revenue}
          change={mockMetrics.revenueGrowth}
          changeType="positive"
          icon={DollarSign}
          description="This month"
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Activity</h2>
        </div>
        
        <div className="overflow-x-auto">
          <DataTable
            data={mockRecentActivity}
            columns={activityColumns}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Growth Trends</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">User Registration</span>
              <span className="text-success font-semibold text-lg">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">SMS Volume</span>
              <span className="text-success font-semibold text-lg">+8.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Revenue</span>
              <span className="text-success font-semibold text-lg">+15.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">Low balance warning</p>
                <p className="text-sm text-muted-foreground">3 users below threshold</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">All systems operational</p>
                <p className="text-sm text-muted-foreground">99.9% uptime this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}