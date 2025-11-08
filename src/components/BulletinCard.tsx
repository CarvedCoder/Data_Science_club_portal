import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

interface BulletinCardProps {
  id: string;
  type: 'event' | 'workshop' | 'hackathon' | 'meeting';
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  attendees?: number;
  isNew?: boolean;
}

export const BulletinCard: React.FC<BulletinCardProps> = ({
  type,
  title,
  description,
  date,
  time,
  location,
  attendees,
  isNew,
}) => {
  const typeColors = {
    event: 'bg-accent/20 text-accent border-accent/30',
    workshop: 'bg-secondary/20 text-secondary border-secondary/30',
    hackathon: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
    meeting: 'bg-primary/20 text-primary border-primary/30',
  };

  const typeIcons = {
    event: '🎯',
    workshop: '🛠️',
    hackathon: '💻',
    meeting: '📋',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="glass-card border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeIcons[type]}</span>
              <Badge variant="outline" className={typeColors[type]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              {isNew && (
                <Badge className="bg-success/20 text-success border-success/30">
                  New
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-white mt-2">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-accent" />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{location}</span>
              </div>
            )}
            {attendees !== undefined && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-accent" />
                <span>{attendees} attendees</span>
              </div>
            )}
          </div>
          <Button variant="ghost" className="w-full mt-4 gap-2 group">
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
