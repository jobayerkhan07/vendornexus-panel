import { useState } from "react"
import { Save, Bell, Shield, Database, Mail, Smartphone, Globe, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    securityAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
  })

  const [system, setSystem] = useState({
    apiRateLimit: "1000",
    sessionTimeout: "30",
    passwordPolicy: "strong",
    twoFactorRequired: false,
    ipWhitelist: "",
    backupFrequency: "daily",
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application preferences and security settings
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save All</span>
              </div>
            )}
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Browser and mobile push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Security Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Important security notifications (recommended)
                      </p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, securityAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={system.sessionTimeout}
                      onChange={(e) =>
                        setSystem({ ...system, sessionTimeout: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">Password Policy</Label>
                    <Select
                      value={system.passwordPolicy}
                      onValueChange={(value) =>
                        setSystem({ ...system, passwordPolicy: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (6+ characters)</SelectItem>
                        <SelectItem value="strong">Strong (8+ chars, mixed case)</SelectItem>
                        <SelectItem value="strict">Strict (12+ chars, symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Require Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">
                        Force all users to enable 2FA
                      </p>
                    </div>
                    <Switch
                      checked={system.twoFactorRequired}
                      onCheckedChange={(checked) =>
                        setSystem({ ...system, twoFactorRequired: checked })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="192.168.1.0/24, 10.0.0.0/8"
                    value={system.ipWhitelist}
                    onChange={(e) =>
                      setSystem({ ...system, ipWhitelist: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of allowed IP ranges (optional)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit (per hour)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={system.apiRateLimit}
                      onChange={(e) =>
                        setSystem({ ...system, apiRateLimit: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={system.backupFrequency}
                      onValueChange={(value) =>
                        setSystem({ ...system, backupFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">125GB</div>
                        <div className="text-sm text-muted-foreground">Storage Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">24ms</div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme Preference</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="cursor-pointer border-2 border-border hover:border-primary transition-colors">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-white border rounded mx-auto mb-2"></div>
                          <div className="text-sm font-medium">Light</div>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer border-2 border-primary transition-colors">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-gray-900 rounded mx-auto mb-2"></div>
                          <div className="text-sm font-medium">Dark</div>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer border-2 border-border hover:border-primary transition-colors">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-900 rounded mx-auto mb-2"></div>
                          <div className="text-sm font-medium">System</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Sidebar Layout</Label>
                      <Select defaultValue="expanded">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expanded">Expanded</SelectItem>
                          <SelectItem value="collapsed">Collapsed</SelectItem>
                          <SelectItem value="mini">Mini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Table Density</Label>
                      <Select defaultValue="comfortable">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}