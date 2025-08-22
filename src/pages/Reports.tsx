import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { 
  BarChart3, TrendingUp, DollarSign, Users, 
  Download, Calendar, Filter 
} from "lucide-react";

// Mock data for reports
const mockRevenueData = [
  { period: "Jan 2024", amount: 23456, growth: "+12.5%" },
  { period: "Dec 2023", amount: 20845, growth: "+8.2%" },
  { period: "Nov 2023", amount: 19234, growth: "+15.1%" },
];

const revenueColumns = [
  { key: "period" as const, label: "Period" },
  { 
    key: "amount" as const, 
    label: "Revenue",
    render: (value: number) => (
      <span className="font-medium text-foreground">${value.toLocaleString()}</span>
    )
  },
  { 
    key: "growth" as const, 
    label: "Growth",
    render: (value: string) => (
      <span className={`font-medium ${value.startsWith('+') ? 'text-success' : 'text-danger'}`}>
        {value}
      </span>
    )
  }
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [dateRange, setDateRange] = useState("last-3-months");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analytics and business intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">$23,456</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-sm text-success font-medium">+12.5%</div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-sm text-success font-medium">+8.2%</div>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">12,847</div>
              <div className="text-sm text-muted-foreground">SMS Processed</div>
              <div className="text-sm text-success font-medium">+15.3%</div>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">96.8%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-sm text-success font-medium">+0.5%</div>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Report Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue Report</SelectItem>
            <SelectItem value="users">User Report</SelectItem>
            <SelectItem value="sms">SMS Report</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-3-months">Last 3 months</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Report Data */}
      <DataTable
        data={mockRevenueData}
        columns={revenueColumns}
      />
    </div>
  );
}