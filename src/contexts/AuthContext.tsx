import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'member';
  name: string;
  email: string;
  attendance: number;
  lastAttendance?: string;
  badges?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'member') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  markAttendance: (sessionId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: Record<string, User> = {
  'admin1': {
    id: '1',
    username: 'admin1',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@datascienceclub.com',
    attendance: 0,
  },
  'member1': {
    id: '2',
    username: 'member1',
    role: 'member',
    name: 'John Smith',
    email: 'john@example.com',
    attendance: 15,
    lastAttendance: '2025-11-05',
    badges: ['Early Bird', 'Regular Attendee'],
  },
  'member2': {
    id: '3',
    username: 'member2',
    role: 'member',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    attendance: 12,
    lastAttendance: '2025-11-04',
    badges: ['Team Player'],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string, role: 'admin' | 'member'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication - in production, this would verify against a real backend
    const foundUser = mockUsers[username];
    
    if (foundUser && foundUser.role === role) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const markAttendance = (sessionId: string): boolean => {
    if (!user || user.role !== 'member') return false;
    
    // In production, this would verify the sessionId against the current active QR code
    const today = new Date().toISOString().split('T')[0];
    
    // Prevent marking attendance twice on the same day
    if (user.lastAttendance === today) {
      return false;
    }
    
    const updatedUser = {
      ...user,
      attendance: user.attendance + 1,
      lastAttendance: today,
    };
    
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Store attendance record
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    attendanceRecords.push({
      userId: user.id,
      username: user.username,
      name: user.name,
      timestamp: new Date().toISOString(),
      sessionId,
    });
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, markAttendance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
