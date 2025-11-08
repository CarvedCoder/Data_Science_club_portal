import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { motion } from 'motion/react';
import { QrCode, CheckCircle2, XCircle, Calendar, Clock, TrendingUp, Scan } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QrScanner from 'react-qr-scanner';

export const MemberAttendance: React.FC = () => {
  const { user, markAttendance } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  // Mock attendance history
  const attendanceHistory = [
    { id: '1', date: '2025-11-05', event: 'Weekly Meeting', status: 'present' as const, time: '5:00 PM' },
    { id: '2', date: '2025-11-03', event: 'Python Workshop', status: 'present' as const, time: '2:00 PM' },
    { id: '3', date: '2025-10-29', event: 'Data Viz Session', status: 'present' as const, time: '4:00 PM' },
    { id: '4', date: '2025-10-27', event: 'Guest Lecture', status: 'present' as const, time: '3:00 PM' },
    { id: '5', date: '2025-10-22', event: 'Club Meeting', status: 'present' as const, time: '5:00 PM' },
  ];

  const handleScan = (data: any) => {
    if (data && !isProcessing) {
      setIsProcessing(true);
      const scannedText = typeof data === 'string' ? data : data.text;
      setScannedData(scannedText);
      setShowScanner(false);
      setIsProcessing(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setShowScanner(false);
    if (err.name === 'NotAllowedError') {
      toast.error('Camera access denied. Please allow camera permissions in your browser settings.');
    } else if (err.name === 'NotFoundError') {
      toast.error('No camera found on this device.');
    } else {
      toast.error('Camera error. Please check permissions and try again.');
    }
  };

  const handleMarkAttendance = () => {
    if (!scannedData) {
      toast.error('Please scan the QR code first');
      return;
    }

    const success = markAttendance(scannedData);
    if (success) {
      toast.success('Attendance marked successfully! 🎉');
      setScannedData(null);
    } else {
      toast.error('Already marked attendance today or invalid QR code');
    }
  };

  const thisMonthAttendance = attendanceHistory.length;
  const attendanceRate = Math.round((user.attendance / 20) * 100);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white">Attendance</h2>
          <Badge variant="outline" className="bg-success/20 text-success border-success/30">
            {user.attendance} Total Sessions
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Scan QR codes to mark your attendance at club events
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-white mt-1">{user.attendance}</p>
                </div>
                <div className="p-3 rounded-lg bg-success/20">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-white mt-1">{thisMonthAttendance}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-white mt-1">{attendanceRate}%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* QR Scanner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <QrCode className="h-5 w-5 text-accent" />
              Mark Your Attendance
            </CardTitle>
            <CardDescription>
              Scan the QR code displayed by the admin to mark your attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showScanner && !scannedData && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-dashed border-accent/30"
                >
                  <Scan className="h-16 w-16 text-accent" />
                </motion.div>
                <p className="text-muted-foreground text-center">
                  Ready to scan? Click the button below to open camera
                </p>
                <Button
                  onClick={() => setShowScanner(true)}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 gap-2"
                >
                  <QrCode className="h-5 w-5" />
                  Open QR Scanner
                </Button>
              </div>
            )}

            {showScanner && (
              <div className="space-y-4">
                <Alert>
                  <Scan className="h-4 w-4" />
                  <AlertDescription>
                    Position the QR code within the frame. Scanning will happen automatically.
                  </AlertDescription>
                </Alert>
                <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden border-2 border-accent">
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    constraints={{
                      video: { facingMode: 'environment' }
                    }}
                  />
                  {/* Scanning corners animation */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-accent animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-accent animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-accent animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-accent animate-pulse"></div>
                </div>
                <Button
                  onClick={() => setShowScanner(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}

            {scannedData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Alert className="bg-success/10 border-success/30">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    QR code scanned successfully! Session ID: {scannedData.substring(0, 8)}...
                  </AlertDescription>
                </Alert>
                <div className="flex gap-4">
                  <Button
                    onClick={handleMarkAttendance}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-success to-accent hover:from-success/90 hover:to-accent/90 gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Confirm Attendance
                  </Button>
                  <Button
                    onClick={() => setScannedData(null)}
                    variant="outline"
                    size="lg"
                  >
                    Scan Again
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-white">Attendance History</CardTitle>
            <CardDescription>Your recent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id} className="border-border/50">
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        {record.date}
                      </TableCell>
                      <TableCell>{record.event}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {record.time}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-success/20 text-success border-success/30"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Present
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
