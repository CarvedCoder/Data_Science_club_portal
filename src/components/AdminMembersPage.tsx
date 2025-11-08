import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { motion } from 'motion/react';
import { Search, Users, UserPlus, Edit, Trash2, Mail, Award } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  attendance: number;
  lastSession: string;
  status: 'active' | 'inactive';
  badges: string[];
}

export const AdminMembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock member data
  const members: Member[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      username: 'member1',
      attendance: 15,
      lastSession: '2025-11-05',
      status: 'active',
      badges: ['Early Bird', 'Regular Attendee'],
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      username: 'member2',
      attendance: 12,
      lastSession: '2025-11-04',
      status: 'active',
      badges: ['Team Player'],
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      username: 'member3',
      attendance: 18,
      lastSession: '2025-11-05',
      status: 'active',
      badges: ['Perfect Attendance', 'Star Member'],
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      username: 'member4',
      attendance: 8,
      lastSession: '2025-10-28',
      status: 'active',
      badges: [],
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david@example.com',
      username: 'member5',
      attendance: 3,
      lastSession: '2025-10-15',
      status: 'inactive',
      badges: [],
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === 'all' || member.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const avgAttendance = Math.round(
    members.reduce((sum, m) => sum + m.attendance, 0) / members.length
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-white">Member Management</h2>
            <p className="text-muted-foreground">
              View and manage all club members
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 gap-2">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
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
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-white mt-1">{totalMembers}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/20">
                  <Users className="h-6 w-6 text-accent" />
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
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-white mt-1">{activeMembers}</p>
                </div>
                <div className="p-3 rounded-lg bg-success/20">
                  <Users className="h-6 w-6 text-success" />
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
                  <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                  <p className="text-white mt-1">{avgAttendance}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/20">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Members Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-white">All Members</CardTitle>
            <CardDescription>
              Search and filter through member records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px] bg-input-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No members found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <span className="text-white text-sm">
                                {member.name.split(' ').map((n) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-white">{member.name}</p>
                              <p className="text-xs text-muted-foreground">@{member.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{member.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-white">{member.attendance}</span>
                            {member.attendance >= 15 && (
                              <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
                                High
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.lastSession}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              member.status === 'active'
                                ? 'bg-success/20 text-success border-success/30'
                                : 'bg-muted/20 text-muted-foreground border-muted'
                            }
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredMembers.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Showing {filteredMembers.length} of {totalMembers} members
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
