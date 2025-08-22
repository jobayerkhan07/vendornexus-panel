import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Send, Users, Mail, Calendar, TrendingUp } from "lucide-react";

const mockCampaigns = [
  { 
    id: 1, 
    name: "Welcome Series", 
    subject: "Welcome to WebHook Panel",
    recipients: 125,
    sent: 125,
    opened: 98,
    clicked: 45,
    status: "Completed",
    date: "2024-01-15"
  },
  { 
    id: 2, 
    name: "Feature Update", 
    subject: "New API Features Available",
    recipients: 89,
    sent: 89,
    opened: 72,
    clicked: 32,
    status: "Completed",
    date: "2024-01-12"
  },
  { 
    id: 3, 
    name: "Maintenance Notice", 
    subject: "Scheduled Maintenance Alert",
    recipients: 200,
    sent: 0,
    opened: 0,
    clicked: 0,
    status: "Draft",
    date: "2024-01-20"
  },
];

const columns = [
  { key: "name" as const, label: "Campaign Name" },
  { key: "subject" as const, label: "Subject" },
  { key: "recipients" as const, label: "Recipients" },
  { key: "sent" as const, label: "Sent" },
  { key: "opened" as const, label: "Opened" },
  { key: "clicked" as const, label: "Clicked" },
  { 
    key: "status" as const, 
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Completed" ? "default" : value === "Draft" ? "secondary" : "outline"}>
        {value}
      </Badge>
    )
  },
  { key: "date" as const, label: "Date" },
];

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage email campaigns</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-muted-foreground">Emails sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-muted-foreground">Average open rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">Average click rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>
              Send emails to your users or resellers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input id="campaign-name" placeholder="Enter campaign name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input id="subject" placeholder="Enter email subject" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="resellers">Resellers Only</SelectItem>
                  <SelectItem value="users">Users Only</SelectItem>
                  <SelectItem value="custom">Custom List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Email Message</Label>
              <Textarea 
                id="message" 
                placeholder="Write your email message here..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Send timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Now</SelectItem>
                  <SelectItem value="later">Schedule for Later</SelectItem>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Recent campaign statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Last Campaign</p>
                  <p className="text-sm text-muted-foreground">Feature Update</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">89</p>
                  <p className="text-sm text-green-600">80.9% opened</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Best Performing</p>
                  <p className="text-sm text-muted-foreground">Welcome Series</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">125</p>
                  <p className="text-sm text-green-600">78.4% opened</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Pending</p>
                  <p className="text-sm text-muted-foreground">Maintenance Notice</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">200</p>
                  <p className="text-sm text-yellow-600">Draft</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign History</CardTitle>
          <CardDescription>
            All your email campaigns and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={mockCampaigns} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}