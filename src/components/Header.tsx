import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Brain, Home, ClipboardCheck, Users, LogOut, Bell } from 'lucide-react';

interface HeaderProps {
  currentPage: 'home' | 'attendance' | 'members';
  onNavigate: (page: 'home' | 'attendance' | 'members') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const isAdmin = user.role === 'admin';

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-accent" />
              <div className="absolute inset-0 blur-lg bg-accent/30"></div>
            </div>
            <div>
              <h1 className="text-white">Data Science Club</h1>
              {isAdmin && (
                <Badge variant="secondary" className="mt-1 bg-secondary/20 text-secondary border-secondary/30">
                  Admin Panel
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={currentPage === 'attendance' ? 'default' : 'ghost'}
              onClick={() => onNavigate('attendance')}
              className="gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              Attendance
            </Button>
            {isAdmin && (
              <Button
                variant={currentPage === 'members' ? 'default' : 'ghost'}
                onClick={() => onNavigate('members')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Members
              </Button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-success rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 px-3">
                  <Avatar className="h-8 w-8 border-2 border-accent/50">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-muted-foreground cursor-default">
                  Role: {user.role}
                </DropdownMenuItem>
                {user.role === 'member' && (
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    Total Attendance: {user.attendance}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive gap-2">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 mt-4">
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            onClick={() => onNavigate('home')}
            size="sm"
            className="gap-2 flex-1"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            variant={currentPage === 'attendance' ? 'default' : 'ghost'}
            onClick={() => onNavigate('attendance')}
            size="sm"
            className="gap-2 flex-1"
          >
            <ClipboardCheck className="h-4 w-4" />
            Attendance
          </Button>
          {isAdmin && (
            <Button
              variant={currentPage === 'members' ? 'default' : 'ghost'}
              onClick={() => onNavigate('members')}
              size="sm"
              className="gap-2 flex-1"
            >
              <Users className="h-4 w-4" />
              Members
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
