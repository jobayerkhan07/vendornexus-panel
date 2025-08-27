import { useState, useEffect } from "react"
import { User, Mail, Shield, Calendar, Save, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    email: "",
    role: "user" as "admin" | "reseller" | "user",
    created_at: "",
    display_name: "",
    bio: "",
    avatar_url: ""
  })
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // For now, use mock data since profiles table structure might vary
      setProfile({
        email: user.email || "",
        role: "admin", // This would come from your profiles table
        created_at: user.created_at,
        display_name: user.user_metadata?.display_name || "",
        bio: "",
        avatar_url: user.user_metadata?.avatar_url || ""
      })
    } catch (err) {
      setError("Failed to load profile")
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          bio: profile.bio
        }
      })

      if (error) {
        setError(error.message)
        return
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "reseller":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and personal information
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {getInitials(profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">
                  {profile.display_name || "User"}
                </CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant={getRoleBadgeVariant(profile.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        placeholder="Enter your display name"
                        value={profile.display_name}
                        onChange={(e) =>
                          setProfile({ ...profile, display_name: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a little about yourself..."
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile (optional)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={fetchProfile}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Security Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account security and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Password</Label>
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <p className="text-xs text-muted-foreground">
                  Last changed 30 days ago
                </p>
              </div>
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <Button variant="outline" className="w-full justify-start">
                  Enable 2FA
                </Button>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}