import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Calendar as CalendarIcon,
  Clock,
  Target,
  Users,
  Plus
} from 'lucide-react';
import { useData } from '../context/DataContext';
import AddEventModal from '../components/modals/AddEventModal';

const CalendarEnhanced = () => {
  const { sprints, milestones, projects, tasks } = useData();
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);

  const getEventsForDate = (targetDate) => {
    const dateStr = targetDate.toISOString().split('T')[0];
    const events = [];

    milestones.forEach(milestone => {
      if (milestone.date === dateStr) {
        const project = projects.find(p => p.id === milestone.projectId);
        events.push({
          type: 'milestone',
          title: milestone.title,
          project: project?.name,
          color: project?.color,
          status: milestone.status
        });
      }
    });

    tasks.forEach(task => {
      if (task.deadline === dateStr) {
        const project = projects.find(p => p.id === task.projectId);
        events.push({
          type: 'deadline',
          title: task.title,
          project: project?.name,
          color: project?.color,
          assignee: task.assignee,
          priority: task.priority
        });
      }
    });

    sprints.forEach(sprint => {
      const sprintStart = new Date(sprint.startDate);
      const sprintEnd = new Date(sprint.endDate);
      if (targetDate >= sprintStart && targetDate <= sprintEnd) {
        events.push({
          type: 'sprint',
          title: sprint.name,
          status: sprint.status,
          color: '#6366f1'
        });
      }
    });

    return events;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const hasEventsOnDate = (targetDate) => {
    return getEventsForDate(targetDate).length > 0;
  };

  const getUpcomingEvents = () => {
    const upcoming = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const events = getEventsForDate(checkDate);
      
      events.forEach(event => {
        upcoming.push({
          ...event,
          date: new Date(checkDate)
        });
      });
    }
    
    return upcoming.slice(0, 10);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">Track sprints, deadlines, and milestones</p>
        </div>
        <Button 
          onClick={() => setShowAddEvent(true)}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="scale-125 origin-top">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setSelectedDate(newDate);
                  }}
                  className="rounded-lg border-2 border-slate-200 p-6 bg-white shadow-sm"
                  modifiers={{
                    hasEvents: (date) => hasEventsOnDate(date)
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      textDecorationColor: '#14b8a6',
                      textDecorationThickness: '3px',
                      color: '#0f766e'
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-teal-500" />
                <span>Has Events</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {selectedDateEvents.map((event, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-lg border-l-4"
                    style={{ 
                      borderColor: event.color,
                      backgroundColor: event.color + '10'
                    }}
                  >
                    <div className="flex items-start gap-3 mb-1">
                      {event.type === 'milestone' && <Target className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: event.color }} />}
                      {event.type === 'deadline' && <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: event.color }} />}
                      {event.type === 'sprint' && <CalendarIcon className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: event.color }} />}
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-slate-900">{event.title}</h4>
                        <p className="text-sm text-slate-600 mt-0.5">{event.project}</p>
                        {event.assignee && (
                          <div className="flex items-center gap-1 mt-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{event.assignee}</span>
                          </div>
                        )}
                        {event.priority && (
                          <Badge className="mt-2" variant="outline">
                            {event.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-base">No events on this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Active Sprints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sprints
                .filter(s => s.status === 'Active')
                .map(sprint => {
                  const daysRemaining = Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={sprint.id} className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{sprint.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-teal-600 text-white">
                          {daysRemaining} days left
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-slate-700 font-medium">Sprint Goals:</div>
                        <ul className="space-y-1">
                          {sprint.goals.map((goal, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-teal-600 mt-0.5">•</span>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.map((event, idx) => {
                const daysUntil = Math.ceil((event.date - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: event.color + '20' }}>
                        <span className="text-xs font-semibold" style={{ color: event.color }}>
                          {event.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </span>
                        <span className="text-base font-bold" style={{ color: event.color }}>
                          {event.date.getDate()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-slate-900 truncate">{event.title}</h4>
                      <p className="text-xs text-slate-600 truncate">{event.project}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-medium text-slate-600">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEventModal isOpen={showAddEvent} onClose={() => setShowAddEvent(false)} />
    </div>
  );
};

export default CalendarEnhanced;