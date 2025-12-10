import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  MoreVertical,
  Grid3x3,
  List
} from 'lucide-react';
import { mockProjects, mockTasks } from '../mockData';

const Projects = () => {
  const [viewMode, setViewMode] = useState('grid');

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700 border-red-200',
      'High': 'bg-amber-100 text-amber-700 border-amber-200',
      'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
      'Low': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[priority] || colors['Medium'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-emerald-100 text-emerald-700',
      'In Progress': 'bg-teal-100 text-teal-700',
      'Planning': 'bg-blue-100 text-blue-700',
      'On Hold': 'bg-slate-100 text-slate-700'
    };
    return colors[status] || colors['Planning'];
  };

  const getProjectTasks = (projectId) => {
    return mockTasks.filter(t => t.projectId === projectId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage and track all your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-teal-500 hover:bg-teal-600' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {mockProjects.map(project => {
          const tasks = getProjectTasks(project.id);
          const completedTasks = tasks.filter(t => t.status === 'Completed').length;
          const budgetPercentage = Math.round((project.budget.actual / project.budget.planned) * 100);
          
          return (
            <Card key={project.id} className="border-slate-200 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-1 h-8 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 ml-3">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status & Priority */}
                <div className="flex items-center gap-2 mb-4 ml-3">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4 ml-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Overall Progress</span>
                    <span className="font-bold text-slate-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2.5" />
                  <p className="text-xs text-slate-500">
                    {completedTasks} of {tasks.length} tasks completed
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 ml-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Deadline</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="text-sm font-semibold text-slate-900">{budgetPercentage}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Team</p>
                      <p className="text-sm font-semibold text-slate-900">{project.team.length}</p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 ml-3">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                        title={member}
                      >
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-slate-600">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="hover:border-teal-500 hover:text-teal-600">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;