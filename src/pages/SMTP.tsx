import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Server, Shield, CheckCircle, AlertCircle, Send } from "lucide-react";

export default function SMTP() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SMTP Configuration</h1>
          <p className="text-muted-foreground">Configure email delivery settings</p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          Test Connection
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <p className="text-xs text-muted-foreground">Last test: 2 hours ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending emails</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SMTP Server Settings</CardTitle>
            <CardDescription>
              Configure your email server connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input id="smtp-port" placeholder="587" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select defaultValue="tls">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Username</Label>
              <Input id="smtp-username" placeholder="your-email@gmail.com" defaultValue="webhook@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Password</Label>
              <Input id="smtp-password" type="password" placeholder="App password" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="smtp-auth" defaultChecked />
              <Label htmlFor="smtp-auth">Enable Authentication</Label>
            </div>
            <Button className="w-full">
              <Server className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Configure email sender and templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-email">From Email</Label>
              <Input id="from-email" placeholder="noreply@company.com" defaultValue="noreply@webhookpanel.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-name">From Name</Label>
              <Input id="from-name" placeholder="Company Name" defaultValue="WebHook Panel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-to">Reply To</Label>
              <Input id="reply-to" placeholder="support@company.com" defaultValue="support@webhookpanel.com" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-tracking" defaultChecked />
              <Label htmlFor="email-tracking">Enable Email Tracking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-queue" defaultChecked />
              <Label htmlFor="email-queue">Use Email Queue</Label>
            </div>
            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Manage email templates for different notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Welcome Email</span>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Sent when a new user registers
              </p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Number Expiry</span>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Notification before number expires
              </p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Payment Confirmation</span>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Sent after successful payment
              </p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}