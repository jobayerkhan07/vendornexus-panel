import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, UserPlus, Shield, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { UserRole, SYSTEM_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PermissionGroup, Permission } from "@/types/permissions";

// Mock data
const currentUserRole: UserRole = "super_admin"; // This would come from auth context
const mockPermissionGroups: PermissionGroup[] = [
  {
    id: "1",
    name: "Reseller Standard",
    description: "Standard reseller permissions with client management",
    targetRole: "reseller",
    permissions: ["users.view", "users.create", "sms.send", "sms.bulk", "reports.view"],
    createdBy: "super-admin",
    createdAt: "2024-01-15",
    isDefault: true
  },
  {
    id: "2",
    name: "Client Basic",
    description: "Basic client access to SMS services",
    targetRole: "client",
    permissions: ["sms.send", "sms.templates", "sms.history", "reports.view"],
    createdBy: "admin-1",
    createdAt: "2024-01-20",
    isDefault: false
  }
];

const getAvailableRoles = (): UserRole[] => {
  if (currentUserRole === "super_admin") return ["admin", "reseller", "client"];
  if (currentUserRole === "admin") return ["reseller", "client"];
  if (currentUserRole === "reseller") return ["client"];
  return [];
};

const getAvailablePermissions = (targetRole: UserRole): string[] => {
  // Get permissions that the current user can grant to the target role
  const currentUserPermissions = DEFAULT_ROLE_PERMISSIONS[currentUserRole] || [];
  const targetRoleMaxPermissions = DEFAULT_ROLE_PERMISSIONS[targetRole] || [];
  
  // User can only grant permissions they have and that are valid for the target role
  return currentUserPermissions.filter(permission => 
    targetRoleMaxPermissions.includes(permission)
  );
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "admin": return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "reseller": return "bg-gradient-to-r from-green-500 to-emerald-500";
    case "client": return "bg-gradient-to-r from-orange-500 to-yellow-500";
    default: return "bg-muted";
  }
};

const groupPermissionsByCategory = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

export default function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRoles = getAvailableRoles();
  const availablePermissions = selectedRole ? getAvailablePermissions(selectedRole) : [];
  const availableGroups = selectedRole ? mockPermissionGroups.filter(g => g.targetRole === selectedRole) : [];
  
  const permissionsToShow = SYSTEM_PERMISSIONS.filter(p => availablePermissions.includes(p.id));
  const categorizedPermissions = groupPermissionsByCategory(permissionsToShow);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedGroup("");
    setCustomPermissions([]);
    setUseCustomPermissions(false);
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setUseCustomPermissions(false);
    setCustomPermissions([]);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setCustomPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const getSelectedPermissions = (): string[] => {
    if (useCustomPermissions) {
      return customPermissions;
    }
    if (selectedGroup) {
      const group = mockPermissionGroups.find(g => g.id === selectedGroup);
      return group?.permissions || [];
    }
    return selectedRole ? DEFAULT_ROLE_PERMISSIONS[selectedRole] || [] : [];
  };

  const selectedPermissions = getSelectedPermissions();
  const isFormValid = email && password && confirmPassword && password === confirmPassword && selectedRole && selectedPermissions.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    try {
      // Here you would typically call an API to create the user
      const userData = {
        email,
        password,
        role: selectedRole,
        permissions: selectedPermissions,
        permissionGroupId: selectedGroup || undefined
      };
      
      console.log("Creating user:", userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedRole("");
      setSelectedGroup("");
      setCustomPermissions([]);
      setUseCustomPermissions(false);
      
      alert("User created successfully!");
      
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New User</h1>
          <p className="text-muted-foreground">Add a new user with role-specific permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the user's email and create a secure password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={selectedRole} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getRoleColor(role)}`} />
                            {role.replace('_', ' ').toUpperCase()}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm the password"
                    required
                  />
                </div>
              </div>

              {password !== confirmPassword && confirmPassword && (
                <Alert>
                  <AlertDescription>Passwords do not match</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Permissions Configuration */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permissions Configuration
                </CardTitle>
                <CardDescription>
                  Configure what the user can access and manage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Permission Groups */}
                {availableGroups.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Use Permission Group</Label>
                      <p className="text-sm text-muted-foreground">Select a pre-configured permission template</p>
                    </div>
                    <Select value={selectedGroup} onValueChange={handleGroupChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a permission group (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="space-y-1">
                              <div className="font-medium">{group.name}</div>
                              <div className="text-xs text-muted-foreground">{group.description}</div>
                              <Badge variant="secondary" className="text-xs">
                                {group.permissions.length} permissions
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Custom Permissions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Custom Permissions</Label>
                      <p className="text-sm text-muted-foreground">
                        {useCustomPermissions ? "Select individual permissions" : "Or customize permissions manually"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useCustom"
                        checked={useCustomPermissions}
                        onCheckedChange={(checked) => {
                          setUseCustomPermissions(!!checked);
                          if (checked) {
                            setSelectedGroup("");
                          } else {
                            setCustomPermissions([]);
                          }
                        }}
                      />
                      <Label htmlFor="useCustom">Use custom permissions</Label>
                    </div>
                  </div>

                  {useCustomPermissions && (
                    <div className="space-y-4">
                      {Object.entries(categorizedPermissions).map(([category, permissions]) => (
                        <Card key={category}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{category}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={permission.id}
                                    checked={customPermissions.includes(permission.id)}
                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <label
                                      htmlFor={permission.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {permission.name}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Permission Summary */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Permission Summary</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedPermissions.length} permissions selected</Badge>
                    {selectedGroup && (
                      <Badge variant="outline">
                        Using group: {mockPermissionGroups.find(g => g.id === selectedGroup)?.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link to="/users">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}