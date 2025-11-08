import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { BulletinCard } from './BulletinCard';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  ClipboardCheck,
  Calendar,
} from 'lucide-react';

interface MemberDashboardProps {
  onNavigateToAttendance: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onNavigateToAttendance }) => {
  const { user } = useAuth();

  if (!user) return null;

  const bulletins = [
    {
      id: '1',
      type: 'workshop' as const,
      title: 'Introduction to Machine Learning',
      description: 'Learn the fundamentals of ML algorithms and practical applications',
      date: 'November 15, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Lab 301',
      attendees: 45,
      isNew: true,
    },
    {
      id: '2',
      type: 'hackathon' as const,
      title: 'AI Hackathon 2025',
      description: 'Build innovative AI solutions in 24 hours with your team',
      date: 'November 22-23, 2025',
      time: '9:00 AM - 9:00 AM',
      location: 'Innovation Hub',
      attendees: 120,
      isNew: true,
    },
    {
      id: '3',
      type: 'meeting' as const,
      title: 'Monthly Club Meeting',
      description: 'Discuss upcoming events and project updates',
      date: 'November 10, 2025',
      time: '5:00 PM - 6:00 PM',
      location: 'Conference Room B',
      attendees: 30,
    },
    {
      id: '4',
      type: 'event' as const,
      title: 'Guest Speaker: Dr. Sarah Chen',
      description: 'AI Ethics and Responsible Data Science',
      date: 'November 18, 2025',
      time: '3:00 PM - 5:00 PM',
      location: 'Main Auditorium',
      attendees: 200,
      isNew: true,
    },
  ];

  const upcomingEvents = bulletins.filter(b => b.isNew).length;
  const attendancePercentage = Math.round((user.attendance / 20) * 100);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 gradient-animate"></div>
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <CardContent className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-white mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-muted-foreground">
                  Ready to continue your data science journey? Check out today's activities below.
                </p>
              </div>
              <Button
                onClick={onNavigateToAttendance}
                size="lg"
                className="bg-gradient-to-r from-success to-accent hover:from-success/90 hover:to-accent/90 shadow-lg shadow-success/20 pulse-glow gap-2"
              >
                <ClipboardCheck className="h-5 w-5" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Attendance"
          value={user.attendance}
          icon={ClipboardCheck}
          subtitle="Sessions attended"
          progress={attendancePercentage}
          iconColor="text-success"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={Calendar}
          subtitle="This month"
          trend={{ value: 20, isPositive: true }}
          iconColor="text-accent"
        />
      </div>

      {/* Bulletin Board */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white">Announcements & Events</h2>
            <p className="text-muted-foreground">Stay updated with club activities</p>
          </div>
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
            {bulletins.length} Active
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bulletins.map((bulletin, index) => (
            <motion.div
              key={bulletin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <BulletinCard {...bulletin} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
