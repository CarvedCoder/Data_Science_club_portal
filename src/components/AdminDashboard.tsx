import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import {
  Users,
  UserCheck,
  TrendingUp,
  Activity,
  QrCode,
  RefreshCw,
  Download,
  Timer,
  Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner@2.0.3';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [qrData, setQrData] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute in seconds
  const [sessionId, setSessionId] = useState('');

  // Generate initial QR code
  useEffect(() => {
    generateNewQR();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          generateNewQR();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateNewQR = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setQrData(newSessionId);
    setTimeRemaining(60);
    toast.success('New QR code generated');
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 320;
      canvas.height = 320;
      
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const url = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `attendance-qr-${sessionId}.png`;
          link.href = url;
          link.click();
          toast.success('QR code downloaded');
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data - in production, this would come from the database
  const totalMembers = 156;
  const todayAttendance = 42;
  const avgAttendance = 78;
  const activeSessions = 1;

  const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
  const todayRecords = attendanceRecords.filter((record: any) => {
    const recordDate = new Date(record.timestamp).toDateString();
    const today = new Date().toDateString();
    return recordDate === today;
  });

  const progressPercentage = (timeRemaining / 60) * 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-white">Admin Dashboard</h2>
          <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
            Administrator
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Manage attendance, monitor analytics, and oversee club operations
        </p>
      </motion.div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={totalMembers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          subtitle="Active members"
          iconColor="text-accent"
        />
        <StatsCard
          title="Today's Attendance"
          value={todayRecords.length}
          icon={UserCheck}
          subtitle="Members present"
          iconColor="text-success"
        />
        <StatsCard
          title="Average Attendance"
          value={`${avgAttendance}%`}
          icon={TrendingUp}
          progress={avgAttendance}
          subtitle="This month"
          iconColor="text-secondary"
        />
        <StatsCard
          title="Active Sessions"
          value={activeSessions}
          icon={Activity}
          subtitle="Currently running"
          iconColor="text-chart-5"
        />
      </div>

      {/* Dynamic QR Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <QrCode className="h-5 w-5 text-accent" />
                  Dynamic QR Code
                </CardTitle>
                <CardDescription>
                  Auto-regenerates every 1 minute for security
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success/30 gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl pulse-glow"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-2xl">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={qrData || 'waiting...'}
                      size={280}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </motion.div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={generateNewQR}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleDownloadQR}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* QR Code Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Remaining</span>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-accent" />
                      <span className="text-white">{formatTime(timeRemaining)}</span>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-sm text-muted-foreground">Session ID</p>
                  <code className="text-xs text-accent break-all">{sessionId}</code>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white">How It Works</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>QR code automatically regenerates every 1 minute</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Members scan the code to verify their attendance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Prevents sharing of QR codes with absent members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Each scan is tracked with timestamp and session ID</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-success" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              Members who marked attendance today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records yet today</p>
                <p className="text-sm mt-2">Records will appear as members scan the QR code</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayRecords.slice(0, 5).map((record: any, index: number) => (
                  <motion.div
                    key={record.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white">
                          {record.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white">{record.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                      Present
                    </Badge>
                  </motion.div>
                ))}
                {todayRecords.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    +{todayRecords.length - 5} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
