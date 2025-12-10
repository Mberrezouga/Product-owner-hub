import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Calendar as CalendarIcon,
  Clock,
  Target,
  Users,
  Plus,
  Video,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import AddEventModal from '../components/modals/AddEventModal';
import AddMeetingModal from '../components/modals/AddMeetingModal';
import EditEventModal from '../components/modals/EditEventModal';

const CalendarViewLarge = () => {
  const { sprints, milestones, projects, tasks } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getEventsForDate = (targetDate) => {
    const dateStr = targetDate.toISOString().split('T')[0];
    const events = [];

    milestones.forEach(milestone => {
      if (milestone.date === dateStr) {
        const project = projects.find(p => p.id === milestone.projectId);
        
        let eventType = 'milestone';
        let icon = Target;
        if (milestone.title.includes('👥') || milestone.title.toLowerCase().includes('meeting')) {
          eventType = 'meeting';
          icon = Video;
        } else if (milestone.title.includes('📞') || milestone.title.toLowerCase().includes('call')) {
          eventType = 'call';
          icon = Phone;
        }
        
        events.push({
          type: eventType,
          title: milestone.title.replace('👥', '').replace('📞', '').trim(),
          project: project?.name,
          color: project?.color || '#6366f1',
          status: milestone.status,
          description: milestone.description,
          icon: icon
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
          color: project?.color || '#f59e0b',
          assignee: task.assignee,
          priority: task.priority,
          icon: Clock
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
          color: '#6366f1',
          icon: CalendarIcon
        });
      }
    });

    return events;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

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
    
    return upcoming.slice(0, 8);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">Large view - Schedule meetings, calls, and track events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowAddMeeting(true)}
            variant="outline"
            className="border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <Video className="h-4 w-4 mr-2" />
            Add Meeting/Call
          </Button>
          <Button 
            onClick={() => setShowAddEvent(true)}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold text-slate-700 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const events = getEventsForDate(date);
                const hasEvents = events.length > 0;
                const today = isToday(date);
                const selected = isSameDay(date, selectedDate);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                      today
                        ? 'border-teal-500 bg-teal-50'
                        : selected
                        ? 'border-emerald-500 bg-emerald-50'
                        : hasEvents
                        ? 'border-slate-200 bg-white hover:border-teal-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <span className={`text-base font-semibold ${
                        today ? 'text-teal-700' : selected ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {date.getDate()}
                      </span>
                      
                      {hasEvents && (
                        <div className="flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
                          {events.slice(0, 3).map((event, idx) => {
                            const Icon = event.icon;
                            return (
                              <div
                                key={idx}
                                className="text-xs px-1 py-0.5 rounded flex items-center gap-1"
                                style={{
                                  backgroundColor: event.color + '20',
                                  color: event.color
                                }}
                              >
                                <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                                <span className="truncate text-[10px] font-medium">
                                  {event.title.substring(0, 8)}
                                </span>
                              </div>
                            );
                          })}
                          {events.length > 3 && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              +{events.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-teal-500" />
                <span className="text-slate-600">Today</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-3 w-3 text-blue-600" />
                <span className="text-slate-600">Meeting</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-purple-600" />
                <span className="text-slate-600">Call</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-teal-600" />
                <span className="text-slate-600">Milestone</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedDateEvents.map((event, idx) => {
                  const Icon = event.icon;
                  // Find the actual milestone object
                  const milestone = milestones.find(m => {
                    const milestoneDate = m.date;
                    const eventDate = selectedDate.toISOString().split('T')[0];
                    const titleMatch = m.title.replace('👥', '').replace('📞', '').trim() === event.title;
                    return milestoneDate === eventDate && titleMatch;
                  });
                  
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border-l-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-opacity-80"
                      style={{
                        borderColor: event.color,
                        backgroundColor: event.color + '10'
                      }}
                      onClick={() => milestone && setEditingEvent(milestone)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: event.color + '30' }}
                        >
                          <Icon className="h-4 w-4" style={{ color: event.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900">{event.title}</h4>
                          {event.project && (
                            <p className="text-xs text-slate-600 mt-0.5">{event.project}</p>
                          )}
                        </div>
                        {event.type === 'meeting' && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Meeting</Badge>
                        )}
                        {event.type === 'call' && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">Call</Badge>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-slate-600 mt-2 ml-10">{event.description}</p>
                      )}
                      
                      <p className="text-xs text-slate-400 mt-2 ml-10">Click to edit or delete</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <CalendarIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-base">No events on this date</p>
                <Button
                  onClick={() => setShowAddMeeting(true)}
                  variant="outline"
                  className="mt-4"
                  size="sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Upcoming Events (Next 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingEvents.map((event, idx) => {
              const daysUntil = Math.ceil((event.date - new Date()) / (1000 * 60 * 60 * 24));
              const Icon = event.icon;
              
              return (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: event.color + '20' }}
                    >
                      <span className="text-[10px] font-semibold" style={{ color: event.color }}>
                        {event.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="text-sm font-bold" style={{ color: event.color }}>
                        {event.date.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="h-3 w-3 flex-shrink-0" style={{ color: event.color }} />
                        <h4 className="font-medium text-xs text-slate-900 truncate">{event.title}</h4>
                      </div>
                      {event.project && (
                        <p className="text-[10px] text-slate-600 truncate">{event.project}</p>
                      )}
                      <p className="text-[10px] text-slate-500 mt-1">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddEventModal isOpen={showAddEvent} onClose={() => setShowAddEvent(false)} />
      <AddMeetingModal 
        isOpen={showAddMeeting} 
        onClose={() => setShowAddMeeting(false)} 
        selectedDate={selectedDate}
      />
      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
      />
    </div>
  );
};

export default CalendarViewLarge;
