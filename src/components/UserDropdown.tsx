"use client";

import React from "react";
import { useAuth } from '@/lib/auth-context';
import { User, Settings, LogOut, Crown, Clock, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  subscription?: {
    status: "active" | "trial" | "expired";
    plan: string;
  };
}

interface UserDropdownProps {
  user: User;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const getSubscriptionIcon = () => {
    if (!user.subscription) return null;
    
    switch (user.subscription.status) {
      case "trial":
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case "active":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "expired":
        return <Crown className="h-3 w-3 text-red-500" />;
      default:
        return <Crown className="h-3 w-3 text-gray-500" />;
    }
  };

  const getSubscriptionColor = () => {
    if (!user.subscription) return "text-gray-500";
    
    switch (user.subscription.status) {
      case "trial":
        return "text-yellow-600";
      case "active":
        return "text-green-600";
      case "expired":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            {user.subscription && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                {getSubscriptionIcon()}
                <div className="flex-1">
                  <p className={`text-xs font-medium ${getSubscriptionColor()}`}>
                    {user.subscription.plan} Plan
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.subscription.status}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {user.subscription?.status === "trial" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings?tab=subscription" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Upgrade to Pro</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown; 