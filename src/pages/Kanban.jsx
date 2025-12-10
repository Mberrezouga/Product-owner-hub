import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  AlertCircle, 
  Calendar, 
  User,
  Plus,
  Filter
} from 'lucide-react';
import { mockTasks, mockProjects } from '../mockData';

const Kanban = () => {
  const [selectedProject, setSelectedProject] = useState('all');

  const columns = [
    { id: 'Not Started', title: 'Not Started', color: 'border-slate-300' },
    { id: 'In Progress', title: 'In Progress', color: 'border-teal-300' },
    { id: 'In Review', title: 'In Review', color: 'border-blue-300' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-300' }
  ];

  const filteredTasks = selectedProject === 'all' 
    ? mockTasks 
    : mockTasks.filter(t => t.projectId === selectedProject);

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-500',
      'High': 'bg-amber-500',
      'Medium': 'bg-blue-500',
      'Low': 'bg-slate-400'
    };
    return colors[priority] || colors['Medium'];
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && deadline;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
          <p className="text-slate-600 mt-1">Manage tasks with drag-and-drop interface</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Projects</option>
            {mockProjects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => {
          const tasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`bg-white border-t-4 ${column.color} rounded-t-lg p-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{column.title}</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {tasks.length}
                  </Badge>
                </div>
              </div>

              {/* Tasks */}
              <div className="bg-slate-50 border border-t-0 border-slate-200 rounded-b-lg p-2 min-h-[500px] space-y-2 overflow-y-auto">
                {tasks.map(task => {
                  const project = mockProjects.find(p => p.id === task.projectId);
                  const overdue = task.status !== 'Completed' && isOverdue(task.deadline);
                  
                  return (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 bg-white">
                      <CardContent className="p-4">
                        {/* Priority Indicator */}
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-1.5 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${getPriorityColor(task.priority)}`} />
                          <div className="flex-1 pl-2">
                            <h4 className="font-semibold text-sm text-slate-900 mb-1">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Project Tag */}
                        <div className="pl-2 mb-2">
                          <span 
                            className="inline-block text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: project?.color + '20',
                              color: project?.color
                            }}
                          >
                            {project?.name}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pl-2 mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Calendar className="h-3 w-3" />
                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                              {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            {overdue && <AlertCircle className="h-3 w-3 text-red-600 ml-1" />}
                          </div>
                          
                          {task.assignee && (
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-xs font-semibold text-white"
                                title={task.assignee}
                              >
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {tasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;