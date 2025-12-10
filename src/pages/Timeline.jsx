import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { mockProjects, mockMilestones } from '../mockData';

const Timeline = () => {
  const [viewMode, setViewMode] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getProjectPosition = (project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const viewStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const viewEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
    
    const totalDays = (viewEnd - viewStart) / (1000 * 60 * 60 * 24);
    const projectStart = Math.max(0, (start - viewStart) / (1000 * 60 * 60 * 24));
    const projectDuration = (end - start) / (1000 * 60 * 60 * 24);
    
    const left = (projectStart / totalDays) * 100;
    const width = (projectDuration / totalDays) * 100;
    
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getMonthsInView = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      result.push({
        month: months[date.getMonth()],
        year: date.getFullYear()
      });
    }
    return result;
  };

  const monthsInView = getMonthsInView();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Timeline View</h1>
          <p className="text-slate-600 mt-1">Visualize project schedules and dependencies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          {/* Month Headers */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-slate-200">
            {monthsInView.map((m, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-lg font-bold text-slate-900">{m.month} {m.year}</h3>
              </div>
            ))}
          </div>

          {/* Projects Timeline */}
          <div className="space-y-4">
            {mockProjects.map(project => {
              const position = getProjectPosition(project);
              const isVisible = position.width !== '0%';
              
              if (!isVisible) return null;
              
              return (
                <div key={project.id} className="relative">
                  {/* Project Name */}
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium text-slate-900 text-sm">{project.name}</span>
                    <Badge className="text-xs">
                      {project.progress}%
                    </Badge>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative h-12 bg-slate-100 rounded-lg">
                    <div 
                      className="absolute h-full rounded-lg flex items-center px-3 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group"
                      style={{ 
                        left: position.left, 
                        width: position.width,
                        backgroundColor: project.color + 'E6'
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium text-white">
                          {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs font-medium text-white">
                          {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      {/* Progress Overlay */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-bl-lg transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMilestones
              .filter(m => m.status !== 'Completed')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(milestone => {
                const project = mockProjects.find(p => p.id === milestone.projectId);
                const daysUntil = Math.ceil((new Date(milestone.date) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={milestone.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{milestone.title}</h4>
                      <p className="text-sm text-slate-600">{project?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">{daysUntil} days away</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-teal-500 to-emerald-500" />
              <span className="text-sm text-slate-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm text-slate-600">Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500" />
              <span className="text-sm text-slate-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">Progress indicator (bottom bar)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timeline;