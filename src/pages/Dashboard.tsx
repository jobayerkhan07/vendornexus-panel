import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DataTable } from "@/components/ui/data-table";
import {
  Users, Phone, MessageSquare, DollarSign,
  TrendingUp, Activity, AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, Metrics, Activity as ActivityItem } from "@/lib/api";

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
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery<Metrics>({
    queryKey: ["metrics"],
    queryFn: api.dashboard.metrics,
  });

  const { data: recentActivity = [], isLoading: activityLoading, error: activityError } = useQuery<ActivityItem[]>({
    queryKey: ["recent-activity"],
    queryFn: api.dashboard.recentActivity,
  });

  if (metricsLoading || activityLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  if (metricsError || activityError || !metrics) {
    return <div className="space-y-6">Error loading dashboard</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your WebHook Panel. Here's an overview of your system.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          change={metrics.userGrowth}
          changeType="positive"
          icon={Users}
          description="Active registered users"
        />
        <MetricsCard
          title="Active Numbers"
          value={metrics.activeNumbers.toLocaleString()}
          change="Currently in pool"
          changeType="neutral"
          icon={Phone}
          description="Numbers ready for use"
        />
        <MetricsCard
          title="SMS Received"
          value={metrics.smsReceived.toLocaleString()}
          change={metrics.smsGrowth}
          changeType="positive"
          icon={MessageSquare}
          description="This month"
        />
        <MetricsCard
          title="Revenue"
          value={metrics.revenue}
          change={metrics.revenueGrowth}
          changeType="positive"
          icon={DollarSign}
          description="This month"
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        </div>

        <DataTable
          data={recentActivity}
          columns={activityColumns}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Growth Trends</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Registration</span>
              <span className="text-success font-medium">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SMS Volume</span>
              <span className="text-success font-medium">+8.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue</span>
              <span className="text-success font-medium">+15.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">System Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-foreground">Low balance warning</p>
                <p className="text-xs text-muted-foreground">3 users below threshold</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-foreground">All systems operational</p>
                <p className="text-xs text-muted-foreground">99.9% uptime this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}