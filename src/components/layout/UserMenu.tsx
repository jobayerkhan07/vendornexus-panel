import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, Settings, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface UserMenuProps {
  user?: {
    email: string
    role: "admin" | "reseller" | "user"
    display_name?: string
    avatar_url?: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        })
        return
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
      navigate("/auth/login")
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
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

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/auth/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link to="/auth/register">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.display_name || user.email} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover border border-border shadow-md" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {user.display_name || "User"}
              </p>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}