import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Key, Settings, Code } from "lucide-react";

const mockAPIConfigs = [
  { 
    id: 1, 
    vendor: "SMS Gateway Pro", 
    endpoint: "https://api.smspro.com/v1", 
    method: "POST",
    status: "Active",
    lastTest: "2024-01-15",
    responseTime: "120ms"
  },
  { 
    id: 2, 
    vendor: "TextFlow API", 
    endpoint: "https://textflow.me/api", 
    method: "GET",
    status: "Active",
    lastTest: "2024-01-14", 
    responseTime: "85ms"
  },
  { 
    id: 3, 
    vendor: "QuickSMS", 
    endpoint: "https://quicksms.io/send", 
    method: "POST",
    status: "Error",
    lastTest: "2024-01-10",
    responseTime: "Timeout"
  },
];

const columns = [
  { key: "vendor" as const, label: "Vendor" },
  { key: "endpoint" as const, label: "API Endpoint" },
  { key: "method" as const, label: "Method" },
  { 
    key: "status" as const, 
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Active" ? "default" : "destructive"}>
        {value}
      </Badge>
    )
  },
  { key: "lastTest" as const, label: "Last Test" },
  { key: "responseTime" as const, label: "Response Time" },
];

export default function VendorAPIs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor APIs</h1>
          <p className="text-muted-foreground">Configure API connections to vendors</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Test All APIs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">102ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure vendor API parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor Name</Label>
              <Input id="vendor" placeholder="Enter vendor name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input id="endpoint" placeholder="https://api.vendor.com/v1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input id="apikey" type="password" placeholder="Enter API key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="params">Custom Parameters</Label>
              <Textarea 
                id="params" 
                placeholder="Additional parameters in JSON format"
                rows={4}
              />
            </div>
            <Button className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>
              Monitor your vendor API connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={mockAPIConfigs} columns={columns} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available User APIs</CardTitle>
          <CardDescription>
            APIs available for your users to integrate with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4" />
                <span className="font-medium">Get Vendor List</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Retrieve list of available vendors via API
              </p>
              <Badge variant="outline">GET /api/vendors</Badge>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4" />
                <span className="font-medium">Get Price</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Get pricing from assigned sell price group
              </p>
              <Badge variant="outline">GET /api/pricing</Badge>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4" />
                <span className="font-medium">Purchase</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Purchase numbers and get response data
              </p>
              <Badge variant="outline">POST /api/purchase</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}